export const getVoterGovActionsQuery = (
  queryType: string,
  itemsPerPage: number,
  offset?: number,
) => `
WITH DelegatedDReps AS (
    ${
      queryType === 'stake'
        ? `
        SELECT 
            dh.view AS drep_id
        FROM 
            delegation_vote AS dv
        JOIN 
            stake_address AS sa ON sa.id = dv.addr_id
        JOIN 
            drep_hash AS dh ON dh.id = dv.drep_hash_id
        WHERE 
            sa.view = $1
        GROUP BY
            dh.view`
        : queryType === 'drep'
          ? `WITH LatestRegistration AS (
            SELECT 
                dr.drep_hash_id, 
                tx_out.stake_address_id as stake_addr,
                ROW_NUMBER() OVER (PARTITION BY dr.drep_hash_id ORDER BY dr.tx_id DESC) AS RegRowNum
            FROM 
                drep_registration AS dr
            LEFT JOIN 
                tx AS reg_tx ON dr.tx_id = reg_tx.id 
            LEFT JOIN 
                tx_out ON reg_tx.id = tx_out.tx_id
            WHERE 
                tx_out.stake_address_id IS NOT NULL
        ),
        DRepDelegations AS (
            SELECT DISTINCT
                dh.view AS original_drep_id,
                COALESCE(delegated_dh.view, dh.view) AS drep_id
            FROM 
                drep_hash AS dh
            LEFT JOIN 
                LatestRegistration AS lr ON dh.id = lr.drep_hash_id AND lr.RegRowNum = 1
            LEFT JOIN 
                delegation_vote AS dv ON lr.stake_addr = dv.addr_id
            LEFT JOIN 
                drep_hash AS delegated_dh ON dv.drep_hash_id = delegated_dh.id
            WHERE 
                dh.view = $1
        )
        SELECT drep_id
        FROM DRepDelegations`
          : `SELECT 
            dh.view AS drep_id
        FROM 
            tx_out AS txo
        JOIN 
            stake_address AS sa ON sa.id = txo.stake_address_id
        JOIN
            delegation_vote AS dv ON dv.addr_id = sa.id
        JOIN 
            drep_hash AS dh ON dh.id = dv.drep_hash_id
        WHERE 
            txo.address = $1
            AND txo.consumed_by_tx_id IS NULL
        GROUP BY
            dh.view
        `
    }
),
GovActions AS (
    SELECT
        SUBSTRING(CAST(gat.hash AS TEXT) FROM 3) AS gov_action_proposal_id,
        gap.type,
        gap.description,
        vp.vote::text,
        va.url,
        ocvd.json AS metadata,
        b.epoch_no AS voting_epoch,
        b.time AS time_voted,
        encode(vt.hash, 'hex') AS vote_tx_hash,
        dh.view
    FROM 
        voting_procedure vp
    JOIN 
        gov_action_proposal gap ON gap.id = vp.gov_action_proposal_id
    JOIN 
        drep_hash dh ON dh.id = vp.drep_voter
    LEFT JOIN 
        voting_anchor va ON va.id = gap.voting_anchor_id
    LEFT JOIN
        off_chain_vote_data AS ocvd ON ocvd.voting_anchor_id = va.id
    JOIN 
        tx gat ON gat.id = gap.tx_id
    JOIN 
        tx vt ON vt.id = vp.tx_id
    JOIN 
        block b ON b.id = vt.block_id
    JOIN 
        DelegatedDReps ddr ON dh.view = ddr.drep_id
)
SELECT * FROM GovActions
ORDER BY time_voted DESC
LIMIT ${itemsPerPage}
OFFSET ${offset}
`;

export const getVoterGovActionsCountQuery = (queryType: string) => `
WITH DelegatedDReps AS (
    ${
      queryType === 'stake'
        ? `
        SELECT 
            dh.view AS drep_id
        FROM 
            delegation_vote AS dv
        JOIN 
            stake_address AS sa ON sa.id = dv.addr_id
        JOIN 
            drep_hash AS dh ON dh.id = dv.drep_hash_id
        WHERE 
            sa.view = $1
        GROUP BY
            dh.view`
        : queryType === 'drep'
          ? `WITH LatestRegistration AS (
            SELECT 
                dr.drep_hash_id, 
                tx_out.stake_address_id as stake_addr,
                ROW_NUMBER() OVER (PARTITION BY dr.drep_hash_id ORDER BY dr.tx_id DESC) AS RegRowNum
            FROM 
                drep_registration AS dr
            LEFT JOIN 
                tx AS reg_tx ON dr.tx_id = reg_tx.id 
            LEFT JOIN 
                tx_out ON reg_tx.id = tx_out.tx_id
            WHERE 
                tx_out.stake_address_id IS NOT NULL
        ),
        DRepDelegations AS (
            SELECT DISTINCT
                dh.view AS original_drep_id,
                COALESCE(delegated_dh.view, dh.view) AS drep_id
            FROM 
                drep_hash AS dh
            LEFT JOIN 
                LatestRegistration AS lr ON dh.id = lr.drep_hash_id AND lr.RegRowNum = 1
            LEFT JOIN 
                delegation_vote AS dv ON lr.stake_addr = dv.addr_id
            LEFT JOIN 
                drep_hash AS delegated_dh ON dv.drep_hash_id = delegated_dh.id
            WHERE 
                dh.view = $1
        )
        SELECT drep_id
        FROM DRepDelegations`
          : `SELECT 
            dh.view AS drep_id
        FROM 
            tx_out AS txo
        JOIN 
            stake_address AS sa ON sa.id = txo.stake_address_id
        JOIN
            delegation_vote AS dv ON dv.addr_id = sa.id
        JOIN 
            drep_hash AS dh ON dh.id = dv.drep_hash_id
        WHERE 
            txo.address = $1
            AND txo.consumed_by_tx_id IS NULL
        GROUP BY
            dh.view
        `
    }
)
SELECT COUNT(*) AS total
FROM 
    voting_procedure vp
JOIN 
    gov_action_proposal gap ON gap.id = vp.gov_action_proposal_id
JOIN 
    drep_hash dh ON dh.id = vp.drep_voter
JOIN 
    DelegatedDReps ddr ON dh.view = ddr.drep_id
`;
