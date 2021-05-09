import React from "react";
import { PropTypes } from "prop-types";
import Wrapper, { A } from "./Wrapper";

function LeftMenuFooter({ version }) {
  return (
    <Wrapper>
      <div className="poweredBy">
        <A
          key="website"
          href="https://johnywalves.com.br"
          target="_blank"
          rel="noopener noreferrer"
        >
          Johny W. Alves
        </A>
        &nbsp;v{version}
      </div>
    </Wrapper>
  );
}

LeftMenuFooter.propTypes = {
  version: PropTypes.string.isRequired,
};

export default LeftMenuFooter;
