import styled from 'styled-components';
import { Box } from '@mui/material';

export const StyledTransactionDetails = styled(Box).attrs({
  className: 'transaction-details',
})`
  .transaction-section {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  h4 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 2rem;
    margin-bottom: 1rem;
    font-weight: bold;
  }

  .detail-row {
    display: flex;
    padding: 6px 0;
    border-bottom: 1px solid #ccced0;
    font-family: 'Space Grotesk', sans-serif;
  }

  .card-label {
    width: fit-content;
    color: #989ca2;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.7px;
  }

  .card-value {
    flex: 1;
    color: #051016;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.7px;
    text-align: left;
  }

  .hash {
    color: #0044a4;
    word-break: break-all;
    text-align: left;
    display: block;
  }

  .status-Invalid {
    background-color: #FDD1DC;
    color: #C5486D;
  }

  .status-Not-included {
    background-color: #FDF6C8;
    color: #645912;
  }

  .status-Cannot-be-decrypted {
    background-color: #FCC2D3;
    color: #A71245;
  }

  .status-Submitted{
    background-color: #E1F5F5;
    color: #005C5C;
  }

  .status-Shielded-inclusion {
    background-color: #DBF5E8;
    color: #2A7A50;
  }

  .status-Unshielded-inclusion {
    background-color: #A8E6CF;
    color: #5CAB78;
  }

  .status-Pending-user-transaction {
    background-color: #FDF6C8;
    color: #645912;
  }

  .tx-status{
    border-radius: 100px;
    padding: 2px 8px;
    font-size: 12px;
    font-weight: bold;
    width: fit-content;
  }

  .info-icon{
    fill: green;
  }

  @media (max-width: 991px) {
    .detail-row {
      flex-direction: column;
    }

    .card-label {
      width: 100%;
      margin-bottom: 4px;
    }
  }
`;
