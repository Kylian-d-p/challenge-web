import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer>
      <nav>
        <ul>
          <li>
            <a href="/conditions-utilisation" target="_blank" rel="noopener noreferrer">
              Conditions d&apos;utilisation
            </a>
          </li>
          <li>
            <a href="/confidentialite" target="_blank" rel="noopener noreferrer">
              Politique de confidentialité
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;