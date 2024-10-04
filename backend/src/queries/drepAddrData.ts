export const getDrepAddrData: string = `
WITH drep_addr_data AS (
    SELECT stake_addr
    FROM (
        SELECT
            dr.id AS reg_id,
            sa.view AS stake_addr,
            ROW_NUMBER() OVER (PARTITION BY dr.drep_hash_id ORDER BY reg_tx_bk.time DESC) AS reg_rn
        FROM
            drep_registration AS dr
        JOIN
            drep_hash AS dh ON dr.drep_hash_id = dh.id
        LEFT JOIN
            tx AS reg_tx ON dr.tx_id = reg_tx.id
        LEFT JOIN
            tx_out ON reg_tx.id = tx_out.tx_id
        LEFT JOIN
            block AS reg_tx_bk ON reg_tx.block_id = reg_tx_bk.id
        JOIN 
            stake_address AS sa ON tx_out.stake_address_id = sa.id
        WHERE
            tx_out.stake_address_id IS NOT NULL
            AND dh.view = $1
    ) AS subquery
    WHERE reg_rn = 1
)
SELECT 
    dad.stake_addr AS stake_address,
    COALESCE(SUM(txo.value), 0) AS total_stake
FROM 
    drep_addr_data dad
LEFT JOIN 
    stake_address sa ON dad.stake_addr = sa.view
LEFT JOIN 
    tx_out txo ON sa.id = txo.stake_address_id AND txo.consumed_by_tx_id IS NULL
GROUP BY 
    dad.stake_addr;
      `;
