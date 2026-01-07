import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {

    return (
        <footer aria-label="Pied de page">
            <div>
                <h3>FIT&FLEX</h3>
                <p>informations et contacts ci-dessous.</p>

                <nav aria-label="Liens du pied de page">
                    <ul>
                        <li><Link href="/"><a>Conditions d&apos;utilisation</a></Link></li>
                        <li><Link href="/privacy"><a>Politique de confidentialité</a></Link></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;