import {
  backgroundColors,
  contentWidthArr,
  fontColors,
  fontFamilyOptions,
  fontSizeOptions,
} from '@/constants/articleProps.ts';
import { useEffect, useRef } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Text } from 'src/ui/text';

import type { ArticleStateType, OptionType } from '@/constants/articleProps.ts';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
  formState: ArticleStateType;
  isOpen: boolean;
  onApply: () => void;
  onClose: () => void;
  onReset: () => void;
  onToggleOpen: () => void;
  setFormState: React.Dispatch<React.SetStateAction<ArticleStateType>>;
};

export const ArticleParamsForm = ({
  formState,
  isOpen,
  onApply,
  onClose,
  onReset,
  onToggleOpen,
  setFormState,
}: ArticleParamsFormProps): React.JSX.Element => {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target;
      if (target instanceof Node && !containerRef.current?.contains(target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleChange =
    (field: keyof ArticleStateType) =>
    (option: OptionType): void => {
      setFormState((prev) => ({ ...prev, [field]: option }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onApply();
  };

  const handleResetClick = (): void => {
    onReset();
  };

  return (
    <>
      <ArrowButton isOpen={isOpen} onClick={onToggleOpen} />
      <aside
        ref={containerRef}
        className={styles.container + (isOpen ? ` ${styles.container_open}` : '')}
      >
        <form className={styles.form} onSubmit={handleSubmit}>
          <Text
            as="h2"
            size={31}
            weight={800}
            uppercase
            family="open-sans"
            className={styles.title}
          >
            Задайте параметры
          </Text>

          <div className={styles.field}>
            <Select
              title="Шрифт"
              options={fontFamilyOptions}
              selected={formState.fontFamilyOption}
              onChange={handleChange('fontFamilyOption')}
            />
          </div>

          <div className={styles.field}>
            <Select
              title="Цвет шрифта"
              options={fontColors}
              selected={formState.fontColor}
              onChange={handleChange('fontColor')}
            />
          </div>

          <div className={styles.fieldColorGroup}>
            <Select
              title="Цвет фона"
              options={backgroundColors}
              selected={formState.backgroundColor}
              onChange={handleChange('backgroundColor')}
            />
          </div>

          <div className={styles.field}>
            <Select
              title="Ширина контента"
              options={contentWidthArr}
              selected={formState.contentWidth}
              onChange={handleChange('contentWidth')}
            />
          </div>

          <div className={styles.field}>
            <RadioGroup
              title="Размер шрифта"
              name="font-size"
              options={fontSizeOptions}
              selected={formState.fontSizeOption}
              onChange={handleChange('fontSizeOption')}
            />
          </div>

          <div className={styles.bottomContainer}>
            <Button
              title="Сбросить"
              htmlType="button"
              type="clear"
              onClick={handleResetClick}
            />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </>
  );
};
