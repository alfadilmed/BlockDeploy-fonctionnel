import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MockConfigPage from './MockConfigPage';
// import '@testing-library/jest-dom';

describe('MockConfigPage', () => {
  const mockOnContextualHelpClick = jest.fn();

  beforeEach(() => {
    mockOnContextualHelpClick.mockClear();
  });

  it('renders the mock config page with fields and help buttons', () => {
    render(<MockConfigPage onContextualHelpClick={mockOnContextualHelpClick} />);

    expect(screen.getByText('Mock BlockDeploy Configuration Page')).toBeInTheDocument();

    // Check for some fields and their help buttons
    expect(screen.getByLabelText('Gas Limit:')).toBeInTheDocument();
    expect(screen.getByTitle('Get help for Gas Limit')).toBeInTheDocument();

    expect(screen.getByLabelText('Replicas:')).toBeInTheDocument();
    expect(screen.getByTitle('Get help for Replicas')).toBeInTheDocument();

    expect(screen.getByLabelText('Token Name:')).toBeInTheDocument();
    expect(screen.getByTitle('Help for Token Name')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Générer config ERC-20 avec l'IA/i })).toBeInTheDocument();
  });

  it('calls onContextualHelpClick with correct arguments for Gas Limit help', () => {
    render(<MockConfigPage onContextualHelpClick={mockOnContextualHelpClick} />);
    const gasLimitHelpButton = screen.getByTitle('Get help for Gas Limit');
    fireEvent.click(gasLimitHelpButton);

    expect(mockOnContextualHelpClick).toHaveBeenCalledTimes(1);
    expect(mockOnContextualHelpClick).toHaveBeenCalledWith(
      "Explique-moi le paramètre 'gasLimit'.",
      "deployment_settings/explain_parameter_gasLimit",
      "gasLimit"
    );
  });

  it('calls onContextualHelpClick with correct arguments for Replicas help', () => {
    render(<MockConfigPage onContextualHelpClick={mockOnContextualHelpClick} />);
    const replicasHelpButton = screen.getByTitle('Get help for Replicas');
    fireEvent.click(replicasHelpButton);

    expect(mockOnContextualHelpClick).toHaveBeenCalledTimes(1);
    expect(mockOnContextualHelpClick).toHaveBeenCalledWith(
      "À quoi sert le paramètre 'replicas' ?",
      "deployment_settings/explain_parameter_replicas",
      "replicas"
    );
  });

  it('calls onContextualHelpClick for ERC-20 config generation', () => {
    render(<MockConfigPage onContextualHelpClick={mockOnContextualHelpClick} />);
    const generateConfigButton = screen.getByRole('button', { name: /Générer config ERC-20 avec l'IA/i });
    fireEvent.click(generateConfigButton);

    expect(mockOnContextualHelpClick).toHaveBeenCalledTimes(1);
    expect(mockOnContextualHelpClick).toHaveBeenCalledWith(
      "Génère une configuration de base pour un token ERC-20 avec le nom 'MyTestToken' et le symbole 'MTT'.",
      "smart_contract_erc20/generate_config",
      "erc20_config"
    );
  });

  it('calls onContextualHelpClick for Token Name help', () => {
    render(<MockConfigPage onContextualHelpClick={mockOnContextualHelpClick} />);
    const tokenNameHelpButton = screen.getByTitle('Help for Token Name');
    fireEvent.click(tokenNameHelpButton);

    expect(mockOnContextualHelpClick).toHaveBeenCalledTimes(1);
    expect(mockOnContextualHelpClick).toHaveBeenCalledWith(
      "Comment bien choisir le nom de mon token ERC-20 ?",
      "smart_contract_erc20/field_tokenName",
      "tokenName"
    );
  });
});
