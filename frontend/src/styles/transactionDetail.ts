import styled from 'styled-components';
import { Box } from '@mui/material';

export const StyledTransactionDetails = styled(Box)`
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
    width: 240px;
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
  }

  .hash {
    color: #0044a4;
    word-break: break-all;
  }

  .status-pending {
    background-color: #fef3a9;
    color: #645912;
    border-radius: 100px;
    padding: 2px 8px;
    font-size: 10px;
    font-weight: bold;
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
