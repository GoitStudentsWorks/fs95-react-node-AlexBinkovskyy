import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import ComponentWithModal from '../Modal/Modal';
import css from './LanguageSwitcher.module.css';

export const LanguageSwitcher = ({ isOpen, isClose }) => {
  const { i18n } = useTranslation();

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const changeFont = (lng) => {
      if (lng === 'uk') {
        document.body.style.fontFamily = 'Montserrat, sans-serif';
      } else {
        document.body.style.fontFamily = 'Poppins, sans-serif';
      }
    };

    changeFont(i18n.language);

    i18n.on('languageChanged', changeFont);

    return () => {
      i18n.off('languageChanged', changeFont);
    };
  }, [i18n]);

  return (
    <>
      <ComponentWithModal isOpen={isOpen} isClose={isClose}>
        <div className={css.modalOverlay}>
          <div className={css.buttonsContainer}>
            <button className={css.langBtn} onClick={() => changeLanguage('en')}>English</button>
            <button className={css.langBtn} onClick={() => changeLanguage('uk')}>Українська</button>
          </div>
        </div>
      </ComponentWithModal>
    </>
  );
};