export const getAllDRepsQuery = (
    sanitizedSearchCondition: string,
    nameFilteredDRepCondition: string,
    campaignStatusCondition: string,
    chainStatusCondition: string,
    orderByClause: string,
    itemsPerPage: number,
    offset: number,
    typeCondition: string,
  ) => `
      WITH DRepDistr AS (
          SELECT *,
                 ROW_NUMBER() OVER (PARTITION BY drep_hash.id ORDER BY drep_distr.epoch_no DESC) AS rn
          FROM drep_distr
                   JOIN drep_hash ON drep_hash.id = drep_distr.hash_id
      ),
           DRepActivity AS (
               SELECT drep_activity AS drep_activity,
                      epoch_no AS epoch_no
               FROM epoch_param
               WHERE epoch_no IS NOT NULL
               ORDER BY epoch_no DESC
          LIMIT 1
          ),
          DRepRegistrationData AS (
      SELECT
          dr.id,
          dr.tx_id,
          dr.drep_hash_id,
          dr.deposit,
          dr.voting_anchor_id,
          tx.hash AS tx_hash,
          block.time AS register_time,
          ROW_NUMBER() OVER (PARTITION BY dr.drep_hash_id ORDER BY dr.tx_id ASC) AS first_register_rn,
          ROW_NUMBER() OVER (PARTITION BY dr.drep_hash_id ORDER BY dr.tx_id DESC) AS newest_register_rn,
          CASE
          WHEN dr.deposit IS NOT NULL AND dr.deposit >= 0 THEN ROW_NUMBER() OVER (PARTITION BY dr.drep_hash_id ORDER BY dr.tx_id DESC)
          ELSE NULL
          END AS non_deregister_voting_anchor_rn
      FROM drep_registration dr
          JOIN tx ON tx.id = dr.tx_id
          JOIN block ON block.id = tx.block_id
          )
  
      SELECT
          encode(dh.raw, 'hex'),
          dh.view,
          va.url,
          DRepDistr.amount AS voting_power,
          dh.has_script,
          (DRepActivity.epoch_no - MAX(COALESCE(block.epoch_no, block_first_register.epoch_no))) <= DRepActivity.drep_activity AS active,
          CASE
          WHEN dr_voting_anchor.deposit = -500000000 THEN TRUE 
          ELSE FALSE
          END AS retired,
          encode(dr_voting_anchor.tx_hash, 'hex') AS tx_hash,
          dr_voting_anchor.register_time AS last_register_time,
          off_chain_vote_drep_data.given_name,
          off_chain_vote_drep_data.image_url,
          COALESCE(dd.vote_count, 0) AS delegation_vote_count,
          COALESCE(dd.live_stake, null) AS live_stake
      FROM drep_hash dh
               LEFT JOIN DRepRegistrationData AS dr_voting_anchor
                         ON dr_voting_anchor.drep_hash_id = dh.id AND dr_voting_anchor.newest_register_rn = 1
               LEFT JOIN DRepRegistrationData AS dr_non_deregister_voting_anchor
                         ON dr_non_deregister_voting_anchor.drep_hash_id = dh.id AND dr_non_deregister_voting_anchor.non_deregister_voting_anchor_rn = 1
               LEFT JOIN DRepRegistrationData AS second_to_newest_drep_registration
                         ON second_to_newest_drep_registration.drep_hash_id = dh.id AND second_to_newest_drep_registration.newest_register_rn = 2
               LEFT JOIN DRepDistr
                         ON DRepDistr.hash_id = dh.id AND DRepDistr.rn = 1
               LEFT JOIN voting_anchor va
                         ON va.id = dr_voting_anchor.voting_anchor_id
               LEFT JOIN voting_anchor non_deregister_voting_anchor
                         ON non_deregister_voting_anchor.id = dr_non_deregister_voting_anchor.voting_anchor_id
               LEFT JOIN off_chain_vote_data
                         ON off_chain_vote_data.voting_anchor_id = va.id
               LEFT JOIN off_chain_vote_drep_data
                         ON off_chain_vote_drep_data.off_chain_vote_data_id = off_chain_vote_data.id
               CROSS JOIN DRepActivity
               LEFT JOIN voting_procedure AS voting_procedure
                         ON voting_procedure.drep_voter = dh.id
               LEFT JOIN tx AS tx
                         ON tx.id = voting_procedure.tx_id
               LEFT JOIN block AS block
                         ON block.id = tx.block_id
               LEFT JOIN DRepRegistrationData AS dr_first_register
                         ON dr_first_register.drep_hash_id = dh.id AND dr_first_register.first_register_rn = 1
               LEFT JOIN tx AS tx_first_register
                         ON tx_first_register.id = dr_first_register.tx_id
               LEFT JOIN block AS block_first_register
                         ON block_first_register.id = tx_first_register.block_id
               LEFT JOIN drepdelegationsummary dd ON dd.drep_hash_id = dh.id
      WHERE 1=1 ${chainStatusCondition} ${sanitizedSearchCondition} ${nameFilteredDRepCondition} ${campaignStatusCondition} ${typeCondition}
      GROUP BY
          dh.raw,
          second_to_newest_drep_registration.voting_anchor_id,
          dh.view,
          va.url,
          voting_power,
          dh.has_script,
          DRepActivity.epoch_no,
          DRepActivity.drep_activity,
          dr_voting_anchor.tx_hash,
          dr_voting_anchor.register_time,
          dr_voting_anchor.deposit,
          off_chain_vote_drep_data.given_name,
          off_chain_vote_drep_data.image_url,
          dd.vote_count,
          dd.live_stake
  
          ${orderByClause}
          LIMIT ${itemsPerPage}
      OFFSET ${offset}
  `;
  export const getTotalResultsQuery = (
      sanitizedSearchCondition: string,
      nameFilteredDRepCondition: string,
      campaignStatusCondition: string,
      chainStatusCondition: string,
      typeCondition: string,
    ) => `
        WITH DRepDistr AS (
            SELECT drep_distr.*, 
                   ROW_NUMBER() OVER (PARTITION BY drep_hash.id ORDER BY drep_distr.epoch_no DESC) AS rn
            FROM drep_distr
            JOIN drep_hash ON drep_hash.id = drep_distr.hash_id
        ),
        DRepActivity AS (
            SELECT drep_activity,
                   epoch_no
            FROM epoch_param
            WHERE epoch_no IS NOT NULL
            ORDER BY epoch_no DESC
            LIMIT 1
        ),
        DRepRegistrationData AS (
            SELECT
                dr.id,
                dr.tx_id,
                dr.drep_hash_id,
                dr.deposit,
                dr.voting_anchor_id,
                tx.hash AS tx_hash,
                block.time AS register_time,
                ROW_NUMBER() OVER (PARTITION BY dr.drep_hash_id ORDER BY dr.tx_id ASC) AS first_register_rn,
                ROW_NUMBER() OVER (PARTITION BY dr.drep_hash_id ORDER BY dr.tx_id DESC) AS newest_register_rn,
                CASE
                    WHEN dr.deposit IS NOT NULL AND dr.deposit >= 0 THEN ROW_NUMBER() OVER (PARTITION BY dr.drep_hash_id ORDER BY dr.tx_id DESC)
                    ELSE NULL
                END AS non_deregister_voting_anchor_rn
            FROM drep_registration dr
            JOIN tx ON tx.id = dr.tx_id
            JOIN block ON block.id = tx.block_id
        )
        SELECT COUNT(DISTINCT dh.id) AS total
        FROM drep_hash dh
            LEFT JOIN DRepRegistrationData AS dr_voting_anchor
                ON dr_voting_anchor.drep_hash_id = dh.id AND dr_voting_anchor.newest_register_rn = 1
            LEFT JOIN DRepRegistrationData AS dr_non_deregister_voting_anchor
                ON dr_non_deregister_voting_anchor.drep_hash_id = dh.id AND dr_non_deregister_voting_anchor.non_deregister_voting_anchor_rn = 1
            LEFT JOIN DRepDistr
                ON DRepDistr.hash_id = dh.id AND DRepDistr.rn = 1
            LEFT JOIN voting_anchor va
                ON va.id = dr_voting_anchor.voting_anchor_id
            LEFT JOIN voting_anchor non_deregister_voting_anchor
                ON non_deregister_voting_anchor.id = dr_non_deregister_voting_anchor.voting_anchor_id
            LEFT JOIN off_chain_vote_data
                ON off_chain_vote_data.voting_anchor_id = va.id
            LEFT JOIN off_chain_vote_drep_data
                ON off_chain_vote_drep_data.off_chain_vote_data_id = off_chain_vote_data.id
            CROSS JOIN DRepActivity
            LEFT JOIN voting_procedure AS voting_procedure
                ON voting_procedure.drep_voter = dh.id
            LEFT JOIN tx AS tx
                ON tx.id = voting_procedure.tx_id
            LEFT JOIN block AS block
                ON block.id = tx.block_id
            LEFT JOIN DRepRegistrationData AS dr_first_register
                ON dr_first_register.drep_hash_id = dh.id AND dr_first_register.first_register_rn = 1
            LEFT JOIN tx AS tx_first_register
                ON tx_first_register.id = dr_first_register.tx_id
            LEFT JOIN block AS block_first_register
                ON block_first_register.id = tx_first_register.block_id
            LEFT JOIN drepdelegationsummary dd
                ON dd.drep_hash_id = dh.id
        WHERE 1=1 
            ${chainStatusCondition} 
            ${sanitizedSearchCondition} 
            ${nameFilteredDRepCondition} 
            ${campaignStatusCondition} 
            ${typeCondition}
    `;
    