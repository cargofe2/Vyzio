// src/lib/gamification.ts — XP engine, ranks, streaks, missions, energy
import { type PrismaClient, type Gamification, RankTier } from "@prisma/client";

export const XP_REWARDS = { lesson_complete:75, lesson_complete_video:90, quiz_perfect_first:100, quiz_correct:60, quiz_consolation:20, project_complete:300, project_published:150, world_complete_bonus:500, level_complete_bonus:2000, daily_streak_7:200, daily_streak_30:500, daily_streak_100:2000, tournament_win:1000, first_lesson:60, first_project:200, invite_friend:150 } as const;

export const STREAK_MULTIPLIERS: Record<number,number> = { 1:1.0, 3:1.1, 7:1.25, 14:1.35, 30:1.5, 60:1.65, 100:1.8 };

export const RANK_XP_THRESHOLDS: Record<RankTier,number> = { NOVICE:0, EXPLORER:500, CREATOR:2000, BUILDER:6000, INNOVATOR:15000, VISIONARY:30000, PIONEER:55000, MASTER:90000, LEGEND:140000, AI_TITAN:200000 };

const RANK_ORDER: RankTier[] = ["NOVICE","EXPLORER","CREATOR","BUILDER","INNOVATOR","VISIONARY","PIONEER","MASTER","LEGEND","AI_TITAN"];

export const ENERGY_CONFIG = { max:100, quizCost:10, rechargePerHour:4, proUnlimited:true };

export const PLAN_ACCESS: Record<string,number[]> = { STARTER:[1], PRO:[1,2,3], PREMIUM:[1,2,3,4], FAMILY:[1,2,3], SCHOOL:[1,2,3], ENTERPRISE:[1,2,3,4] };

export function getRankFromXP(xp:number): RankTier { let r:RankTier="NOVICE"; for(const t of RANK_ORDER){ if(xp>=RANK_XP_THRESHOLDS[t]) r=t; else break; } return r; }

export function getXPToNextRank(xp:number) { const cr=getRankFromXP(xp); const ci=RANK_ORDER.indexOf(cr); if(ci===RANK_ORDER.length-1) return {nextRank:null,xpNeeded:0,progress:1}; const nr=RANK_ORDER[ci+1]; const ct=RANK_XP_THRESHOLDS[cr]; const nt=RANK_XP_THRESHOLDS[nr]; return {nextRank:nr,xpNeeded:nt-xp,progress:Math.min((xp-ct)/(nt-ct),1)}; }

export function getStreakMultiplier(s:number): number { let m=1.0; for(const [d,mult] of Object.entries(STREAK_MULTIPLIERS)){ if(s>=parseInt(d)) m=mult; } return m; }

export function isStudiedToday(d:Date|null): boolean { if(!d) return false; const t=new Date(),l=new Date(d); return t.getFullYear()===l.getFullYear()&&t.getMonth()===l.getMonth()&&t.getDate()===l.getDate(); }

export function isStreakAlive(d:Date|null): boolean { if(!d) return false; const y=new Date(); y.setDate(y.getDate()-1); const l=new Date(d); return isStudiedToday(d)||(y.getFullYear()===l.getFullYear()&&y.getMonth()===l.getMonth()&&y.getDate()===l.getDate()); }

export async function awardXP({prisma,userId,gamification,baseXP,reason,meta={},plan="STARTER"}: {prisma:PrismaClient;userId:string;gamification:Gamification;baseXP:number;reason:string;meta?:Record<string,unknown>;plan?:string}) {
  const isPro=plan!=="STARTER";
  const studiedToday=isStudiedToday(gamification.lastStudyDate);
  const streakAlive=isStreakAlive(gamification.lastStudyDate);
  let newStreak=gamification.streakDays, streakBroken=false;
  if(!studiedToday){ if(streakAlive){ newStreak++; } else { streakBroken=gamification.streakDays>0; newStreak=1; } }
  const multiplier=isPro?getStreakMultiplier(newStreak):1.0;
  const xpAwarded=Math.round(baseXP*multiplier*gamification.xpMultiplier);
  const newXPTotal=gamification.xpTotal+xpAwarded;
  const oldRank=gamification.rank; const newRank=getRankFromXP(newXPTotal); const rankChanged=newRank!==oldRank;
  const updated=await prisma.gamification.update({ where:{userId}, data:{ xpTotal:newXPTotal, xpWeekly:{increment:xpAwarded}, rank:newRank, rankLevel:RANK_ORDER.indexOf(newRank)+1, streakDays:newStreak, streakMax:Math.max(gamification.streakMax,newStreak), lastStudyDate:new Date(), ...(reason==="lesson_complete"?{lessonsCompleted:{increment:1}}:{}), ...(reason==="quiz_perfect_first"?{quizPerfect:{increment:1}}:{}), ...(reason==="project_published"?{projectsPublished:{increment:1}}:{}) } });
  await prisma.xpEvent.create({ data:{amount:xpAwarded,reason,meta:{baseXP,multiplier,...meta},gamificationId:updated.id} });
  const milestones: Record<number,string> = {7:"daily_streak_7",30:"daily_streak_30",100:"daily_streak_100"};
  if(!studiedToday&&milestones[newStreak]){ const bonus=XP_REWARDS[milestones[newStreak] as keyof typeof XP_REWARDS]; await prisma.gamification.update({where:{userId},data:{xpTotal:{increment:bonus},xpWeekly:{increment:bonus}}}); }
  const achievements=await checkAndAwardAchievements({prisma,userId,gamification:{...updated,streakDays:newStreak}});
  return {xpAwarded,multiplier,newXPTotal,newRank,rankChanged,newStreak,streakBroken,achievements};
}

export async function checkAndAwardAchievements({prisma,userId,gamification}: {prisma:PrismaClient;userId:string;gamification:Gamification}) {
  const earnedIds=(await prisma.userAchievement.findMany({where:{userId},select:{achievementId:true}})).map(ua=>ua.achievementId);
  const candidates=await prisma.achievement.findMany({where:{id:{notIn:earnedIds}}});
  const earned: string[]=[];
  for(const a of candidates){
    let ok=false;
    if(a.triggerType==="lessons_completed") ok=gamification.lessonsCompleted>=a.triggerValue;
    else if(a.triggerType==="streak_days") ok=gamification.streakDays>=a.triggerValue;
    else if(a.triggerType==="quiz_perfect") ok=gamification.quizPerfect>=a.triggerValue;
    else if(a.triggerType==="projects_published") ok=gamification.projectsPublished>=a.triggerValue;
    else if(a.triggerType==="xp_total") ok=gamification.xpTotal>=a.triggerValue;
    if(ok){ await prisma.userAchievement.create({data:{userId,achievementId:a.id}}); if(a.xpBonus>0||a.gemBonus>0) await prisma.gamification.update({where:{userId},data:{xpTotal:{increment:a.xpBonus},xpWeekly:{increment:a.xpBonus},gems:{increment:a.gemBonus}}}); earned.push(a.slug); }
  }
  return earned;
}

export async function updateMissionProgress({prisma,userId,event,value=1}: {prisma:PrismaClient;userId:string;event:string;value?:number}) {
  const now=new Date();
  const missions=await prisma.mission.findMany({where:{isActive:true,targetType:event,OR:[{endsAt:null},{endsAt:{gte:now}}]},include:{progress:{where:{userId,completed:false}}}});
  for(const m of missions){
    const ex=m.progress[0];
    if(ex){ const nc=Math.min(ex.current+value,m.targetValue); const done=nc>=m.targetValue; await prisma.missionProgress.update({where:{id:ex.id},data:{current:nc,completed:done,completedAt:done?now:undefined}}); }
    else { const nc=Math.min(value,m.targetValue); await prisma.missionProgress.create({data:{userId,missionId:m.id,current:nc,completed:nc>=m.targetValue,completedAt:nc>=m.targetValue?now:undefined}}); }
  }
}

export function computeCurrentEnergy(stored:number,lastUpdated:Date,plan:string): number { if(plan!=="STARTER") return ENERGY_CONFIG.max; return Math.min(stored+Math.floor((Date.now()-lastUpdated.getTime())/(1000*60*60)*ENERGY_CONFIG.rechargePerHour),ENERGY_CONFIG.max); }

export function hasEnoughEnergy(stored:number,lastUpdated:Date,plan:string): boolean { if(plan!=="STARTER") return true; return computeCurrentEnergy(stored,lastUpdated,plan)>=ENERGY_CONFIG.quizCost; }

export function canAccessLevel(plan:string,levelNumber:number): boolean { return (PLAN_ACCESS[plan]??[1]).includes(levelNumber); }

export async function resetWeeklyXP(prisma:PrismaClient) { await prisma.gamification.updateMany({data:{xpWeekly:0}}); }
