import styled, { css } from "styled-components";

const Wrapper = styled.div`
  ${({ theme }) => css`
    position: absolute;
    width: 100%;
    background: ${theme.main.colors.won.blue};
    bottom: 0;
    .poweredBy {
      width: 100%;
      bottom: 0;
      height: 3rem;
      padding-left: 15px;
      padding-right: 15px;
      line-height: 3rem;
      background-color: rgba(255, 255, 255, 0.02);
      font-size: 1rem;
      font-weight: 400;
      letter-spacing: 0.05rem;
      vertical-align: middle;
      color: ${theme.main.colors.strapi["gray-light"]};
    }
  `}
`;

export const A = styled.a`
  ${({ theme }) => css`
    color: ${theme.main.colors.won.orange};

    &:hover {
      color: ${theme.main.colors.won.orange};
      text-decoration: underline;
    }
  `}
`;

export default Wrapper;
