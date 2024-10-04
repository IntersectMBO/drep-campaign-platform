export const getDRepMetadataQuery = `
    SELECT dh.view,
            vd.json AS metadata
    FROM drep_hash dh
    LEFT JOIN (
        SELECT dr.id,
            dr.drep_hash_id,
            dr.voting_anchor_id,
            ROW_NUMBER() OVER (PARTITION BY dr.drep_hash_id ORDER BY dr.tx_id DESC) AS rn,
            tx.hash AS tx_hash
        FROM drep_registration dr
        JOIN tx ON tx.id = dr.tx_id
    ) AS dr_voting_anchor ON dr_voting_anchor.drep_hash_id = dh.id AND dr_voting_anchor.rn = 1
    LEFT JOIN voting_anchor va ON va.id = dr_voting_anchor.voting_anchor_id
    LEFT JOIN off_chain_vote_data vd ON vd.voting_anchor_id = va.id
    WHERE dh.view = $1`;
