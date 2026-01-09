import Link from "next/link";

export default function Footer() {
  return (
    <footer aria-label="Pied de page">
      <div>
        <h3>FIT&FLEX</h3>
          <ul>
            <li>
              <Link href="/">
                <a>Conditions d&apos;utilisation</a>
              </Link>
            </li>
            <li>
              <Link href="/privacy">
                <a>Politique de confidentialité</a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
