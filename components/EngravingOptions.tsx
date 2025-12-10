"use client";

import { useState } from "react";
import Image from "next/image";
import { Engraving, EngravingData } from "@/types";

interface EngravingOptionsProps {
  options: Engraving[];
  onEngravingChange: (engraving: EngravingData | null) => void;
}

export default function EngravingOptions({ options, onEngravingChange }: EngravingOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<Engraving | null>(null);
  const [text, setText] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleOptionChange = (option: Engraving | null) => {
    setSelectedOption(option);
    setText("");
    setLogoFile(null);
    setLogoPreview(null);
    setCloudinaryUrl(null);

    if (!option) {
      onEngravingChange(null);
    }
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    updateEngravingData(newText, cloudinaryUrl);
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      alert("Formats acceptés : PNG, JPG, JPEG, SVG");
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La taille du fichier ne doit pas dépasser 5 MB");
      return;
    }

    setLogoFile(file);

    // Créer une preview locale
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload vers Cloudinary via Strapi
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('logo', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload/engraving-logo`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload');
      }

      const data = await response.json();
      const uploadedUrl = data.url;

      setCloudinaryUrl(uploadedUrl);
      updateEngravingData(text, uploadedUrl);
    } catch (error) {
      console.error('Erreur upload logo:', error);
      alert('Erreur lors de l\'upload du logo. Veuillez réessayer.');
      setLogoFile(null);
      setLogoPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const updateEngravingData = (currentText: string, logoUrl: string | null) => {
    if (!selectedOption) return;

    // Vérifier que l'utilisateur a fourni au moins une des options autorisées
    const hasText = selectedOption.allowText && currentText.trim().length > 0;
    const hasLogo = selectedOption.allowLogo && logoUrl !== null;

    if (hasText || hasLogo) {
      onEngravingChange({
        type: selectedOption.documentId,
        label: selectedOption.title,
        price: selectedOption.price,
        text: currentText || undefined,
        logoUrl: logoUrl || undefined,
      });
    } else {
      onEngravingChange(null);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
        Personnalisation par gravure disponible
      </h3>

      {/* Options de gravure */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="engraving"
              checked={selectedOption === null}
              onChange={() => handleOptionChange(null)}
              className="w-4 h-4 text-primary focus:ring-primary"
            />
            <span className="text-text">Pas de gravure</span>
          </label>
        </div>

        {options.map((option) => (
          <div key={option.documentId}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="engraving"
                checked={selectedOption?.documentId === option.documentId}
                onChange={() => handleOptionChange(option)}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-text font-medium">{option.title}</span>
              <span className="text-accent font-semibold">+{option.price.toFixed(2)} €</span>
            </label>
            {option.description && (
              <p className="text-xs text-gray-600 ml-6 mt-1">{option.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Champs de personnalisation */}
      {selectedOption && (
        <div className="mt-4 space-y-4 p-4 bg-white rounded-md border border-blue-100">
          {selectedOption.allowText && (
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Texte à graver {!selectedOption.allowLogo || selectedOption.allowLogo ? "(optionnel)" : ""}
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Ex: Jean Dupont"
                maxLength={selectedOption.textMaxLength}
                className="w-full px-4 py-2 border border-accent/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum {selectedOption.textMaxLength} caractères</p>
            </div>
          )}

          {selectedOption.allowLogo && (
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Logo à graver
              </label>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="logo-upload"
                  className={`inline-flex items-center justify-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors text-sm font-semibold ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isUploading ? "Upload en cours..." : logoFile ? `Fichier sélectionné : ${logoFile.name}` : "Choisir un fichier"}
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                  onChange={handleLogoChange}
                  className="hidden"
                  disabled={isUploading}
                />
                <p className="text-xs text-gray-500">Formats acceptés : PNG, JPG, SVG (max 5 MB)</p>
              </div>

              {logoPreview && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">Aperçu :</p>
                  <Image
                    src={logoPreview}
                    alt="Aperçu du logo"
                    width={96}
                    height={96}
                    className="object-contain border border-gray-300 rounded-md"
                    unoptimized
                  />
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-gray-600 italic">
            {selectedOption.allowText && selectedOption.allowLogo && "Veuillez ajouter un texte et un logo pour valider votre gravure"}
            {selectedOption.allowText && !selectedOption.allowLogo && "Veuillez ajouter un texte pour valider votre gravure"}
            {!selectedOption.allowText && selectedOption.allowLogo && "Veuillez ajouter un logo pour valider votre gravure"}
          </p>
        </div>
      )}
    </div>
  );
}
