export const getStakeKeyData: string = `
SELECT sa.view AS stake_address,
COALESCE(SUM(txo.value), 0) AS total_stake
FROM stake_address AS sa
JOIN tx_out txo ON sa.id = txo.stake_address_id AND txo.consumed_by_tx_id IS NULL
WHERE sa.view = $1
GROUP BY sa.view`;

