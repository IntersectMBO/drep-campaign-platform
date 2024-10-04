export const getAddrDataQuery: string = `
WITH address_stake AS (
    SELECT 
        stake_address_id
    FROM 
        tx_out
    WHERE 
        address = $1
    LIMIT 1
)
SELECT 
    sa.view AS stake_address,
    COALESCE(SUM(tx_out.value), 0) AS total_stake
FROM 
    tx_out
JOIN
    address_stake ON tx_out.stake_address_id = address_stake.stake_address_id
JOIN
    stake_address AS sa ON sa.id = tx_out.stake_address_id
WHERE 
    tx_out.consumed_by_tx_id IS NULL
GROUP BY 
    sa.view;
    `;
