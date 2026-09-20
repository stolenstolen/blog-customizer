import {
  backgroundColors,
  contentWidthArr,
  defaultArticleState,
  fontColors,
  fontFamilyOptions,
  fontSizeOptions,
} from '@/constants/articleProps.ts';
import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Text } from 'src/ui/text';

import type { ArticleStateType, OptionType } from '@/constants/articleProps.ts';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
  onApply: (newState: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
  onApply,
}: ArticleParamsFormProps): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<ArticleStateType>(defaultArticleState);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target;
      if (target instanceof Node && !containerRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleChange =
    (field: keyof ArticleStateType) =>
    (option: OptionType): void => {
      setFormState((prev) => ({ ...prev, [field]: option }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onApply(formState);
  };

  const handleResetClick = (): void => {
    setFormState(defaultArticleState);
    onApply(defaultArticleState);
  };

  return (
    <>
      <ArrowButton isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
      <aside
        ref={containerRef}
        className={clsx(styles.container, {
          [styles.container_open]: isOpen,
        })}
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
            <RadioGroup
              title="Размер шрифта"
              name="font-size"
              options={fontSizeOptions}
              selected={formState.fontSizeOption}
              onChange={handleChange('fontSizeOption')}
            />
          </div>

          <div className={`${styles.field} ${styles.fontColorField}`}>
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
