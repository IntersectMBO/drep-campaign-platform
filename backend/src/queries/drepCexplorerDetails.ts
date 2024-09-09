export const getDrepCexplorerDetailsQuery: string = `
    WITH LatestRegistration AS (
        SELECT 
          dr.id AS reg_id, 
          dr.drep_hash_id, 
          dr.voting_anchor_id, 
          dr.deposit,
          va.url AS metadata_url,
          ROW_NUMBER() OVER (PARTITION BY dr.drep_hash_id ORDER BY reg_tx_bk.time DESC) AS RegRowNum
        FROM 
          drep_registration AS dr
        LEFT JOIN 
          voting_anchor AS va ON dr.voting_anchor_id = va.id
        LEFT JOIN 
          tx AS reg_tx ON dr.tx_id = reg_tx.id 
        LEFT JOIN 
          block AS reg_tx_bk ON reg_tx.block_id = reg_tx_bk.id
      )
      , RankedRows AS (
        WITH latest_delegations AS (
          SELECT 
            dv.addr_id,
            MAX(b.time) as latest_time
          FROM 
            delegation_vote dv
          JOIN 
            tx ON dv.tx_id = tx.id
          JOIN 
            block b ON tx.block_id = b.id
          GROUP BY 
            dv.addr_id
        )
        SELECT 
          dh.id AS drep_hash_id, 
          dh.raw, 
          dh.view,
          dh.has_script, 
          dd.id AS drep_distr_id, 
          dd.amount, 
          dd.epoch_no, 
          dd.active_until,
          lr.deposit, 
          lr.reg_id AS reg_drep_hash_id, 
          lr.voting_anchor_id AS reg_voting_anchor_id,  
          lr.metadata_url,
          sa.view AS stake_address,
          (
            SELECT COUNT(DISTINCT dv_inner.addr_id)
            FROM delegation_vote dv_inner
            JOIN latest_delegations ld ON dv_inner.addr_id = ld.addr_id
            JOIN tx ON dv_inner.tx_id = tx.id
            JOIN block b ON tx.block_id = b.id AND b.time = ld.latest_time
            WHERE dv_inner.drep_hash_id = dh.id
          ) AS delegation_vote_count,
          ROW_NUMBER() OVER (PARTITION BY dh.id ORDER BY dd.epoch_no DESC) AS RowNum
        FROM 
          drep_hash AS dh
        LEFT JOIN 
          drep_distr AS dd ON dh.id = dd.hash_id
        LEFT JOIN 
          LatestRegistration AS lr ON dh.id = lr.drep_hash_id AND lr.RegRowNum = 1
        LEFT JOIN 
          delegation_vote AS dv ON dh.id = dv.drep_hash_id 
        LEFT JOIN 
          stake_address AS sa ON dv.addr_id = sa.id 
        WHERE 
          dh.view = $1
      )
      SELECT 
        drep_hash_id,
        view,
        delegation_vote_count,
        stake_address,
        amount,
        epoch_no,
        active_until,
        deposit,
        metadata_url,
        has_script
      FROM 
        RankedRows
      WHERE 
        RowNum = 1`;
