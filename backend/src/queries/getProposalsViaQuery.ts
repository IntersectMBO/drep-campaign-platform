export const getProposalByHashQuery = `
SELECT 
    ga.id, 
    ga.type, 
    ga.description, 
   SUBSTRING(CAST(gov_tx.hash AS TEXT) FROM 3) AS hash,
tx_block.time AS prop_inception_time
FROM 
    "gov_action_proposal" as ga
LEFT JOIN
    tx as gov_tx 
ON 
    ga.tx_id = gov_tx.id
LEFT JOIN 
block as tx_block on gov_tx.block_id=tx_block.id
WHERE 
    SUBSTRING(CAST(gov_tx.hash AS TEXT) FROM 3) LIKE $1
LIMIT 50;
`;
