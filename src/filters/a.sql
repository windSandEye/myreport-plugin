-- select
--         a.trade_num as trade_num,
--         CASE WHEN b.trade_num = 0
--             THEN 0
--             ELSE CAST((a.trade_num-b.trade_num) AS DOUBLE)/b.trade_num
--             END   AS trade_num_ratio, -- 周同比

--         a.quota_num as quota_num,
--         CASE WHEN b.quota_num = 0
--             THEN 0
--             ELSE CAST((a.quota_num-b.quota_num) AS DOUBLE)/b.quota_num
--             END   AS quota_num_ratio, -- 周同比

--         a.user_num as user_num,
--         CASE WHEN b.user_num = 0
--             THEN 0
--             ELSE CAST((a.user_num-b.user_num) AS DOUBLE)/b.user_num
--             END   AS user_num_ratio, -- 周同比

--         a.trade_num_lastweek4 as trade_num_lastweek4,
--         CASE WHEN b.trade_num_lastweek4 = 0
--             THEN 0
--             ELSE CAST((a.trade_num_lastweek4-b.trade_num_lastweek4) AS DOUBLE)/b.trade_num_lastweek4
--             END   AS trade_num_lastweek4_ratio, -- 周同比

--         a.quota_num_lastweek4 as quota_num_lastweek4,
--         CASE WHEN b.quota_num_lastweek4 = 0
--             THEN 0
--             ELSE CAST((a.quota_num_lastweek4-b.quota_num_lastweek4) AS DOUBLE)/b.quota_num_lastweek4
--             END   AS quota_num_lastweek4_ratio, -- 周同比

--         a.user_num_lastweek4 as user_num_lastweek4,
--         CASE WHEN b.user_num_lastweek4 = 0
--             THEN 0
--             ELSE CAST((a.user_num_lastweek4-b.user_num_lastweek4) AS DOUBLE)/b.user_num_lastweek4
--             END   AS user_num_lastweek4_ratio
-- -- 周同比

-- from
--         --使用笔数
--         ( select
--                 'tag' as tag
--         , sum(case when  trade_mark='today' then cast(trade_num as bigint) else 0 end) as trade_num
--         , sum(case when  trade_mark='today' then  cast(total_amount as DOUBLE) else 0 end) as quota_num
--         , sum(case when  trade_mark='today' then cast(business_principal_num as bigint) else 0 end) as user_num
--         , sum( cast(trade_num as bigint) ) as trade_num_lastweek4
--         , sum(  cast(total_amount as DOUBLE)) as quota_num_lastweek4
--         , sum( cast(business_principal_num as bigint)) as user_num_lastweek4
--         from antddm.adm_ddm_intimatepay_trade_dd
--         where trade_mark='today'
--                 and dt='${bizdate}'
--     ) a
--         left JOIN
--         (select
--                 'tag' as tag,
--                 sum(case when  trade_mark='today' then cast(trade_num as bigint) else 0 end) as trade_num
--         , sum(case when  trade_mark='today' then  cast(total_amount as DOUBLE) else 0 end) as quota_num
--         , sum(case when  trade_mark='today' then cast(business_principal_num as bigint) else 0 end) as user_num
--         , sum( cast(trade_num as bigint) ) as trade_num_lastweek4
--         , sum(  cast(total_amount as DOUBLE)) as quota_num_lastweek4
--         , sum( cast(business_principal_num as bigint)) as user_num_lastweek4
--         from antddm.adm_ddm_intimatepay_trade_dd
--         where trade_mark='today'
--                 and dt=to_char(date_add(to_date(${bizdate}, 'yyyyMMdd'), interval '7' day), 'yyyyMMdd')
--     ) b on a.tag=b.tag



-- select
--         CASE WHEN b.exposure_num = 0
--             THEN 0
--             ELSE CAST(a.today_exposure_num AS DOUBLE)/b.exposure_num
--             END   AS exposure_ratio
-- -- 曝光率
-- from
--         (select
--                 exposure,
--                 sum(cast(agreement_num as bigint)) as today_exposure_num
--         from pangu.payexpopz.explore_adm_ddm_intimatepay_agreement_dd
--         where dir0=${reportDate} and exposure='render' 
--         group by exposure) a
-- left join
-- (
--         select
--                 exposure,
--                 sum(cast(agreement_num as bigint)) as exposure_num
--         from pangu.payexpopz.explore_adm_ddm_intimatepay_agreement_dd
--         where exposure='render'
--         group by exposure) b
-- on a.exposure=b.exposure
-- limit 100


-- select
--         a.sign_cnt_day as sign_cnt_day,
--         CASE WHEN b.sign_cnt_day = 0
--             THEN 0
--             ELSE CAST((a.sign_cnt_day-b.sign_cnt_day) AS DOUBLE)/b.sign_cnt_day
--             END   AS sign_cnt_day_ratio, -- 周同比

--         a.sign_cnt as sign_cnt,
--         CASE WHEN b.sign_cnt = 0
--             THEN 0
--             ELSE CAST((a.sign_cnt-b.sign_cnt) AS DOUBLE)/b.sign_cnt
--             END   AS sign_cnt_ratio, -- 周同比

--         a.un_sign_cnt_day as un_sign_cnt_day,
--         CASE WHEN b.un_sign_cnt_day = 0
--             THEN 0
--             ELSE CAST((a.un_sign_cnt_day-b.un_sign_cnt_day) AS DOUBLE)/b.un_sign_cnt_day
--             END   AS un_sign_cnt_day_ratio, -- 周同比

--         a.un_sign_cnt as un_sign_cnt,
--         CASE WHEN b.un_sign_cnt = 0
--             THEN 0
--             ELSE CAST((a.un_sign_cnt-b.un_sign_cnt) AS DOUBLE)/b.un_sign_cnt
--             END   AS un_sign_cnt_ratio, -- 周同比

--         a.sign_and_unsign_cnt_day as sign_and_unsign_cnt_day,
--         CASE WHEN b.sign_and_unsign_cnt_day = 0
--             THEN 0
--             ELSE CAST((a.sign_and_unsign_cnt_day-b.sign_and_unsign_cnt_day) AS DOUBLE)/b.sign_and_unsign_cnt_day
--             END   AS sign_and_unsign_cnt_day_ratio, -- 周同比

--         a.sign_and_unsign_cnt as sign_and_unsign_cnt,
--         CASE WHEN b.sign_and_unsign_cnt = 0
--             THEN 0
--             ELSE CAST((a.sign_and_unsign_cnt-b.sign_and_unsign_cnt) AS DOUBLE)/b.sign_and_unsign_cnt
--             END   AS sign_and_unsign_cnt_ratio
-- -- 周同比

-- from
--         ( select
--          dir0 as dt
--         , sum(case when  curr_status = 'sign' and sign_mark = 'sign_0day' then cast(agreement_num as bigint) else 0 end) as sign_cnt_day
--         , sum(case when  curr_status = 'sign' then  cast(agreement_num as DOUBLE) else 0 end) as sign_cnt
--         , sum(case when  curr_status = 'unsign' and unsign_mark = 'unsign_0day' then cast(agreement_num as bigint) else 0 end) as un_sign_cnt_day
--         , sum(case when  curr_status = 'unsign' then cast(agreement_num as bigint) else 0 end) as un_sign_cnt
--         , sum(case when  sign_mark = 'sign_0day' and unsign_mark = 'unsign_0day' then cast(agreement_num as bigint) else 0 end) as sign_and_unsign_cnt_day
--         , sum(cast(agreement_num as bigint))as sign_and_unsign_cnt
--         from pangu.payexpopz.explore_adm_ddm_intimatepay_agreement_dd
--         where dir0 BETWEEN ${beginDate} and ${endDate}
--         group by dir0
--     ) a
--         left JOIN
--         (select
--         dir0 as dt
--         , sum(case when  curr_status = 'sign' and sign_mark = 'sign_0day' then cast(agreement_num as bigint) else 0 end) as sign_cnt_day
--         , sum(case when  curr_status = 'sign' then  cast(agreement_num as DOUBLE) else 0 end) as sign_cnt
--         , sum(case when  curr_status = 'unsign' and unsign_mark = 'unsign_0day' then cast(agreement_num as bigint) else 0 end) as un_sign_cnt_day
--         , sum(case when  curr_status = 'unsign' then cast(agreement_num as bigint) else 0 end) as un_sign_cnt
--         , sum(case when  sign_mark = 'sign_0day' and unsign_mark = 'unsign_0day' then cast(agreement_num as bigint) else 0 end) as sign_and_unsign_cnt_day
--         , sum(cast(agreement_num as bigint))as sign_and_unsign_cnt
--         from pangu.payexpopz.explore_adm_ddm_intimatepay_agreement_dd
--         where dir0  BETWEEN to_char(date_sub(to_date(${beginDate}, 'yyyyMMdd'), interval '7' day), 'yyyyMMdd') 
--                 AND to_char(date_sub(to_date(${endDate}, 'yyyyMMdd'), interval '7' day), 'yyyyMMdd')
--         group by dir0
--     ) b on a.dt=to_char(date_add(to_date(b.dt, 'yyyyMMdd'), interval '7' day), 'yyyyMMdd')
--     order by dir0 desc
-- limit 500


-- SELECT 
--     dir0,
--     sum(a.user_cnt+0) as user_cnt_from
-- FROM (
-- SELECT 
--     dir0
--      ,pay_ability_yesterday AS pay_ability 
--      ,COUNT(*)  AS user_cnt 
--     FROM pangu.payexpopz.explore_adm_ddm_active_user_pay_ability_change_detail_ds
--  WHERE dir0 = ${reportDate} 
--  #if(@{nodename}=="4")
--     AND pay_ability_yesterday = '4'
--    AND pay_ability_today <> '4'
--  #elseif (@{nodename}=="3")
--     AND pay_ability_yesterday = '3'
--    AND pay_ability_today <> '3'
--  #elseif (@{nodename}=="2")
--     AND pay_ability_yesterday = '2'
--    AND pay_ability_today <> '2'
--  #elseif (@{nodename}=="0和1")
--     AND pay_ability_yesterday  in ( '0','1')
--    AND pay_ability_today not in ( '1','0')
--    #elseif (@{nodename}=="注册")
--    AND pay_ability_yesterday  in ( '-')
--    AND pay_ability_today not in ( '-')
--  #end 
-- GROUP BY dir0,pay_ability_yesterday
-- )  a
-- group by dir0
-- limit 100


-- SELECT 
--     from_a.dir0 as dir0,
--    (from_a.user_cnt_from - lost_b.user_cnt_lost) as user_cnt_add
--  from
-- (SELECT 
--     dir0,
--     sum(a.user_cnt+0) as user_cnt_from
-- FROM (
-- SELECT 
--     dir0
--      ,pay_ability_yesterday AS pay_ability 
--      ,COUNT(*)  AS user_cnt 
--     FROM pangu.payexpopz.explore_adm_ddm_active_user_pay_ability_change_detail_ds
--  WHERE dir0 between ${beginDate} and ${endDate} 
--  #if(@{nodename}=="4")
--     AND pay_ability_yesterday <> '4' 
--     AND pay_ability_today = '4'
--  #elseif (@{nodename}=="3")
--     AND pay_ability_yesterday <> '3' 
--     AND pay_ability_today = '3' 
--  #elseif (@{nodename}=="2")
--     AND pay_ability_yesterday <> '2' 
--     AND pay_ability_today = '2' 
--  #elseif (@{nodename}=="0和1")
--     AND pay_ability_yesterday not in ( '0','1') 
--     AND pay_ability_today in ( '1','0') 
--  #elseif (@{nodename}=="注册")
--    AND pay_ability_yesterday not in ( '-')
--    AND pay_ability_today  in ( '-')
--  #end 
-- GROUP BY dir0,pay_ability_yesterday
-- )  a
-- group by dir0
-- ) from_a

-- left join 
-- (SELECT 
-- 			dir0,
--     sum(b.user_cnt+0) as user_cnt_lost
-- FROM (
-- SELECT 
--     dir0
--      ,pay_ability_today AS pay_ability 
--      ,COUNT(*)  AS user_cnt 
--     FROM pangu.payexpopz.explore_adm_ddm_active_user_pay_ability_change_detail_ds
--  WHERE dir0 between ${beginDate} and ${endDate} 
--  #if(@{nodename}=="4")
--     AND pay_ability_yesterday = '4'
--    AND pay_ability_today <> '4'
--  #elseif (@{nodename}=="3")
--     AND pay_ability_yesterday = '3'
--    AND pay_ability_today <> '3'
--  #elseif (@{nodename}=="2")
--     AND pay_ability_yesterday = '2'
--    AND pay_ability_today <> '2'
--  #elseif (@{nodename}=="0和1")
--     AND pay_ability_yesterday  in ( '0','1')
--    AND pay_ability_today not in ( '1','0')
--    #elseif (@{nodename}=="注册")
--    AND pay_ability_yesterday  in ( '-')
--    AND pay_ability_today not in ( '-')
--  #end 
-- GROUP BY dir0,pay_ability_today
-- )  b
-- group by dir0
--  ) lost_b
-- on from_a.dir0=lost_b.dir0
-- order by dir0
-- limit 100

SELECT
    a.pay_ability_add as pay_ability_add
    , a.pay_ability_lost as pay_ability_lost
    , (a.pay_ability_add - a.pay_ability_lost) as pay_ability_net
    , CASE WHEN b.pay_ability_add = 0
            THEN 0
            ELSE CAST((a.pay_ability_add-b.pay_ability_add) AS DOUBLE)/b.pay_ability_add
            END   AS pay_ability_add_ratio  --新增日环比
    , CASE WHEN b.pay_ability_lost = 0
            THEN 0
            ELSE CAST((a.pay_ability_lost-b.pay_ability_lost) AS DOUBLE)/b.pay_ability_lost
            END   AS pay_ability_lost_ratio  --流失日环比
    , CASE WHEN (b.pay_ability_add - b.pay_ability_lost) = 0
            THEN 0
            ELSE CAST((a.pay_ability_add - a.pay_ability_lost - b.pay_ability_add + b.pay_ability_lost) AS DOUBLE)/(b.pay_ability_add - b.pay_ability_lost)
            END   AS pay_ability_net_ratio  --净增日环比
FROM
    (SELECT
        'tag' as tag,
        #if(@{nodename}=="4")
        SUM(CASE WHEN pay_ability_today = '4'
            AND COALESCE(pay_ability_yesterday ,'-') <> '4' THEN cast(user_cnt as bigint) 
                ELSE 0 
            END ) as pay_ability_add,
        SUM(CASE WHEN COALESCE(pay_ability_today ,'-') <> '4'
            AND pay_ability_yesterday = '4' THEN cast(user_cnt as bigint) 
                ELSE 0 
            END ) as pay_ability_lost
        #elseif (@{nodename}=="3")
        SUM(CASE WHEN pay_ability_today = '3'
            AND COALESCE(pay_ability_yesterday ,'-') <> '3' THEN cast(user_cnt as bigint) 
                ELSE 0 
            END ) as pay_ability_add,
        SUM(CASE WHEN COALESCE(pay_ability_today ,'-') <> '3'
            AND pay_ability_yesterday = '3' THEN cast(user_cnt as bigint) 
                ELSE 0 
            END ) as pay_ability_lost
        #elseif (@{nodename}=="2")
        SUM(CASE WHEN pay_ability_today = '2'
            AND COALESCE(pay_ability_yesterday ,'-') <> '2' THEN cast(user_cnt as bigint) 
                ELSE 0 
            END ) as pay_ability_add,
        SUM(CASE WHEN COALESCE(pay_ability_today ,'-') <> '2'
            AND pay_ability_yesterday = '2' THEN cast(user_cnt as bigint) 
                ELSE 0 
            END ) as pay_ability_lost
        #elseif (@{nodename}=="0和1")
        SUM(CASE WHEN pay_ability_today not in ( '0','1','-1')
            AND pay_ability_yesterday in ( '1','0','-1')  THEN cast(user_cnt as bigint) 
                ELSE 0 
            END ) as pay_ability_add,
        SUM(CASE WHEN pay_ability_today in ( '0','1','-1')
            AND pay_ability_yesterday not in ( '1','0','-1') THEN cast(user_cnt as bigint) 
                ELSE 0 
            END ) as pay_ability_lost
        #elseif (@{nodename}=="注册")
        SUM(CASE WHEN pay_ability_today = '-'
                THEN cast(user_cnt as bigint) 
                ELSE 0 
            END ) as pay_ability_add,
        0 as pay_ability_lost
        #end
    FROM pangu.payexpopz.explore_adm_ddm_active_user_pay_ability_change_statistics_ds
    WHERE dir0 = ${reportDate} 
 ) a
 LEFT JOIN
(
SELECT
    'tag' as tag,
    #if(@{nodename}=="4")
        SUM(CASE WHEN pay_ability_today = '4'
            AND COALESCE(pay_ability_yesterday ,'-') <> '4' THEN cast(user_cnt as bigint) 
                ELSE 0 
            END ) as pay_ability_add,
        SUM(CASE WHEN COALESCE(pay_ability_today ,'-') <> '4'
            AND pay_ability_yesterday = '4' THEN cast(user_cnt as bigint) 
                ELSE 0 
            END ) as pay_ability_lost
        #elseif (@{nodename}=="3")
        SUM(CASE WHEN pay_ability_today = '3'
            AND COALESCE(pay_ability_yesterday ,'-') <> '3' THEN cast(user_cnt as bigint) 
                ELSE 0 
            END ) as pay_ability_add,
        SUM(CASE WHEN COALESCE(pay_ability_today ,'-') <> '3'
            AND pay_ability_yesterday = '3' THEN cast(user_cnt as bigint) 
                ELSE 0 
            END ) as pay_ability_lost
        #elseif (@{nodename}=="2")
        SUM(CASE WHEN pay_ability_today = '2'
            AND COALESCE(pay_ability_yesterday ,'-') <> '2' THEN cast(user_cnt as bigint) 
                ELSE 0 
            END ) as pay_ability_add,
        SUM(CASE WHEN COALESCE(pay_ability_today ,'-') <> '2'
            AND pay_ability_yesterday = '2' THEN cast(user_cnt as bigint) 
                ELSE 0 
            END ) as pay_ability_lost
        #elseif (@{nodename}=="0和1")
        SUM(CASE WHEN pay_ability_today not in ( '0','1','-1')
            AND pay_ability_yesterday in ( '1','0','-1')  THEN cast(user_cnt as bigint) 
                ELSE 0 
            END ) as pay_ability_add,
        SUM(CASE WHEN pay_ability_today in ( '0','1','-1')
            AND pay_ability_yesterday not in ( '1','0','-1') THEN cast(user_cnt as bigint) 
                ELSE 0 
            END ) as pay_ability_lost
        #elseif (@{nodename}=="注册")
        SUM(CASE WHEN pay_ability_today = '-'
                THEN cast(user_cnt as bigint) 
                ELSE 0 
            END ) as pay_ability_add,
        0 as pay_ability_lost
        #end
FROM pangu.payexpopz.explore_adm_ddm_active_user_pay_ability_change_statistics_ds
WHERE dir0 = to_char(date_add(to_date(${reportDate}, 'yyyyMMdd'), interval '-1' day), 'yyyyMMdd')
 ) b
 ON a.tag=b.tag
 limit 100



 SELECT a.dir0,
    (a.user_cnt - b.user_cnt) as user_cnt
    FROM
(SELECT   dir0
      ,sum(user_cnt+0)     AS user_cnt 
  FROM pangu.payexpopz.explore_adm_ddm_active_user_pay_ability_change_statistics_ds
 WHERE dir0 BETWEEN ${beginDate} AND ${endDate} 
    #if(@{nodename}=="4")
        AND pay_ability_yesterday <> '4' 
        AND pay_ability_today = '4'
    #elseif (@{nodename}=="3") 
        AND pay_ability_yesterday <> '3' 
        AND pay_ability_today = '3'
    #elseif (@{nodename}=="2")
        AND pay_ability_yesterday <> '2' 
        AND pay_ability_today = '2' 
    #elseif (@{nodename}=="0和1")
        AND pay_ability_yesterday not in ( '0','1','-1') 
        AND pay_ability_today in ( '0','1','-1')  
    #elseif (@{nodename}=="注册")
        AND pay_ability_today = '注册' 
    #end 
GROUP BY dir0) a
LEFT JOIN
(SELECT dir0
      ,sum(user_cnt+0)              AS user_cnt 
  FROM pangu.payexpopz.explore_adm_ddm_active_user_pay_ability_change_statistics_ds
 WHERE dir0 BETWEEN ${beginDate} AND ${endDate} 
    #if(@{nodename}=="4")
        AND pay_ability_yesterday = '4' 
        AND pay_ability_today <> '4'
    #elseif (@{nodename}=="3") 
        AND pay_ability_yesterday = '3' 
        AND pay_ability_today <> '3'
    #elseif (@{nodename}=="2")
        AND pay_ability_yesterday = '2' 
        AND pay_ability_today <> '2' 
    #elseif (@{nodename}=="0和1")
        AND pay_ability_yesterday in ( '0','1','-1') 
        AND pay_ability_today not in ( '0','1','-1') 
 	#end
GROUP BY dir0
) b
ON a.dir0 = b.dir0
order by dir0
limit 100



select 
a.dt,
a.trade_num,
CASE WHEN a.trade_num AND b.trade_num AND b.trade_num=0
            THEN 0
            ELSE CAST((a.trade_num-b.trade_num) AS DOUBLE)/b.trade_num
            END   AS wow         -- 周同比
from
(
select 
dir0 as dt,
sum(cast(trade_num as bigint)) as trade_num
from pangu.payexpopz.explore_adm_ddm_intimatepay_trade_dd       
where dir0 between ${beginDate} and ${endDate}
		and trade_mark='today' 
group by dir0
) as a
left join 
 (
 select 
dir0 as dt,
sum(cast(trade_num as bigint)) as trade_num
from pangu.payexpopz.explore_adm_ddm_intimatepay_trade_dd       
where dir0 between to_char(date_sub(to_date(${beginDate}, 'yyyyMMdd'), interval '7' day), 'yyyyMMdd') 
        and to_char(date_sub(to_date(${endDate}, 'yyyyMMdd'), interval '7' day), 'yyyyMMdd') 
        and trade_mark='today' 
group by dir0
 ) as b
 on a.dt=to_char(date_add(to_date(b.dt, 'yyyyMMdd'), interval '7' day), 'yyyyMMdd')
order by a.dt desc
limit 500