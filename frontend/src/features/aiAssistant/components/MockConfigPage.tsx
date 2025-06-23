import React from 'react';

interface MockConfigPageProps {
  onContextualHelpClick: (query: string, contextLocation: string, fieldId?: string) => void;
}

const sectionStyle: React.CSSProperties = {
  border: '1px solid #e0e0e0',
  padding: '15px',
  marginBottom: '20px',
  borderRadius: '5px',
  backgroundColor: '#fff',
};

const fieldStyle: React.CSSProperties = {
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
};

const labelStyle: React.CSSProperties = {
  minWidth: '120px',
  marginRight: '10px',
};

const inputStyle: React.CSSProperties = {
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  flexGrow: 1,
};

const helpButtonStyle: React.CSSProperties = {
  marginLeft: '10px',
  padding: '5px 8px',
  fontSize: '0.8em',
  cursor: 'pointer',
  backgroundColor: '#f0f0f0',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const MockConfigPage: React.FC<MockConfigPageProps> = ({ onContextualHelpClick }) => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f8' }}>
      <h2>Mock BlockDeploy Configuration Page</h2>

      <div style={sectionStyle}>
        <h3>Deployment Settings</h3>
        <div style={fieldStyle}>
          <label htmlFor="gasLimit" style={labelStyle}>Gas Limit:</label>
          <input type="text" id="gasLimit" defaultValue="3000000" style={inputStyle} />
          <button
            style={helpButtonStyle}
            onClick={() => onContextualHelpClick("Explique-moi le paramètre 'gasLimit'.", "deployment_settings/explain_parameter_gasLimit", "gasLimit")}
            title="Get help for Gas Limit"
          >
            ❓
          </button>
        </div>
        <div style={fieldStyle}>
          <label htmlFor="replicas" style={labelStyle}>Replicas:</label>
          <input type="number" id="replicas" defaultValue="1" style={inputStyle} />
          <button
            style={helpButtonStyle}
            onClick={() => onContextualHelpClick("À quoi sert le paramètre 'replicas' ?", "deployment_settings/explain_parameter_replicas", "replicas")}
            title="Get help for Replicas"
          >
            ❓
          </button>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3>Smart Contract: ERC-20 Token</h3>
        <div style={fieldStyle}>
          <label htmlFor="tokenName" style={labelStyle}>Token Name:</label>
          <input type="text" id="tokenName" defaultValue="MyTestToken" style={inputStyle} />
           <button
            style={helpButtonStyle}
            onClick={() => onContextualHelpClick("Comment bien choisir le nom de mon token ERC-20 ?", "smart_contract_erc20/field_tokenName", "tokenName")}
            title="Help for Token Name"
          >
            ❓
          </button>
        </div>
         <div style={fieldStyle}>
          <label htmlFor="tokenSymbol" style={labelStyle}>Token Symbol:</label>
          <input type="text" id="tokenSymbol" defaultValue="MTT" style={inputStyle} />
        </div>
        <button
            style={{...helpButtonStyle, marginTop: '10px' }}
            onClick={() => onContextualHelpClick("Génère une configuration de base pour un token ERC-20 avec le nom 'MyTestToken' et le symbole 'MTT'.", "smart_contract_erc20/generate_config", "erc20_config")}
        >
            Générer config ERC-20 avec l'IA
        </button>
      </div>

      <p style={{marginTop: '30px', fontSize: '0.9em', color: '#555'}}>
        This is a mock page. The AI Assistant panel should be usable alongside this content.
        Clicking the ❓ buttons should interact with the assistant.
      </p>
    </div>
  );
};

export default MockConfigPage;
