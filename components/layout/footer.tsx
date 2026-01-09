export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-800">Fit&Flex</h3>
          <p className="text-sm text-gray-600">Votre partenaire pour une vie active et en forme</p>
          <p className="text-xs text-gray-500">© {currentYear} Fit&Flex. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
