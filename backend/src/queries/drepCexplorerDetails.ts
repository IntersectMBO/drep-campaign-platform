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
      ),
      LatestDelegation AS (
          SELECT 
            dv.addr_id,
            dv.drep_hash_id,
            ROW_NUMBER() OVER (PARTITION BY dv.addr_id ORDER BY b.time DESC) AS row_num
          FROM 
            delegation_vote dv
          JOIN 
            tx ON dv.tx_id = tx.id
          JOIN 
            block b ON tx.block_id = b.id
        ),
      DRepDelegationData AS (
          SELECT 
            dh.id AS drep_hash_id,
            COUNT(DISTINCT ld.addr_id) AS vote_count,
            SUM(tx_out.value) AS live_stake
          FROM 
            drep_hash dh
          JOIN 
            LatestDelegation ld ON dh.id = ld.drep_hash_id AND ld.row_num = 1
          JOIN 
            stake_address sa ON ld.addr_id = sa.id
          JOIN 
            tx_out ON sa.id = tx_out.stake_address_id
          WHERE 
            tx_out.consumed_by_tx_id IS NULL
          GROUP BY 
            dh.id
        ),
      RankedRows AS (
        SELECT 
          dh.id AS drep_hash_id, 
          dh.raw, 
          dh.view,
          dh.has_script, 
          dd.id AS drep_distr_id, 
          COALESCE(dd.amount, null) AS voting_power,
          dd.epoch_no, 
          dd.active_until,
          lr.deposit, 
          lr.reg_id AS reg_drep_hash_id, 
          lr.voting_anchor_id AS reg_voting_anchor_id,  
          lr.metadata_url,
          sa.view AS stake_address,
          (lr.deposit iS NOT NULL AND lr.deposit < 0) AS retired,
          COALESCE(dd_data.vote_count, 0) AS delegation_vote_count,
          COALESCE(dd_data.live_stake, null) AS live_stake,
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
        LEFT JOIN 
          DRepDelegationData dd_data ON dd_data.drep_hash_id = dh.id 
        WHERE 
          dh.view = $1
      )
      SELECT 
        drep_hash_id,
        view,
        delegation_vote_count,
        stake_address,
        voting_power,
        live_stake,
        epoch_no,
        retired,
        active_until,
        deposit,
        metadata_url,
        has_script
      FROM 
        RankedRows
      WHERE 
        RowNum = 1`;
