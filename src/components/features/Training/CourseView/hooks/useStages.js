// Hooks
import useQuizes from "./useQuizes";
import { useMemo, useState, useCallback } from "react";

// Utils
import isValidObject from "utils/isValidObject";
import createStages from "../utils/createStages";
import createValidObject from "utils/createValidObject";
import resetScrollPosition from "utils/onboarding/resetScrollPosition";

// Constants
import { QUIZ } from "../Stage/types";
import { RENDER_NEXT_STAGE, RENDER_PREV_STAGE } from "../actions";

/**
 * Hook for implements stages visibility of the course
 * @param {object} props Props
 */
export default function useStages({ course }) {
  // Get stages of the course
  const stages = useMemo(() => createStages(course), [course]);

  const [stage, setStage] = useState(() => {
    // Get stage based 'stageId' property
    const stageFound = stages.find((item) => item?._id === course?.stageId);
    return stageFound ? stageFound : stages[0];
  });

  const quizesData = useQuizes({ stage, course });

  const { quizes } = quizesData;

  // Check if has stage
  const hasStage = useMemo(() => isValidObject(stage), [stage]);

  // Get stage index
  const stageIndex = useMemo(
    () => stages.findIndex((item) => item?._id === stage?._id),
    [stage, stages]
  );

  const [maxStageIndex, setMaxStageIndex] = useState(() =>
    stageIndex <= 0 ? 0 : stageIndex
  );

  // Check if is showing back button
  const isShowingBackButton = useMemo(() => stageIndex > 0, [stageIndex]);

  // Callback for render course stage based index
  const getNextStage = useCallback(() => {
    // Get index
    const index = stageIndex + 1;

    // Get next stage
    const nextStage = stages[index];

    // Validate 'nextStage' param
    if (!isValidObject(nextStage)) return createValidObject(stages[0]);

    return { ...nextStage, index: index };
  }, [stages, stageIndex]);

  // Callback for render course stage based index
  const handleRenderStage = useCallback(
    (action) => {
      // Check if is render next stage
      const isRenderNextStage = action === RENDER_NEXT_STAGE;
      const isRenderPreviousStage = action === RENDER_PREV_STAGE;

      if (isRenderPreviousStage) {
        resetScrollPosition();
      }

      // Define stage index
      const index = isRenderNextStage ? stageIndex + 1 : stageIndex - 1;

      // Get stage to render
      let stageToRender = stages[index];

      // Check if is Quiz stage
      if (stageToRender?.type === QUIZ) {
        // Check if has quiz
        const hasQuiz = quizes.some(
          (item) => item?.stageId === stageToRender?._id
        );

        // Omit Quiz stage if already has sent
        if (hasQuiz) {
          stageToRender = stages[isRenderNextStage ? index + 1 : index - 1];
        }
      }

      // Validate 'stageToRender' param
      if (!isValidObject(stageToRender)) return createValidObject(stages[0]);

      setStage(stageToRender);

      return { ...stageToRender, index: index };
    },
    [stages, stageIndex]
  );

  return {
    ...quizesData,

    stage: stage,
    stages: stages,
    setStage: setStage,
    stageIndex: stageIndex,
    maxStageIndex: maxStageIndex,

    hasStage: hasStage,
    isShowingBackButton: isShowingBackButton,

    getNextStage: getNextStage,
    setMaxStageIndex: setMaxStageIndex,
    renderNextStage: () => handleRenderStage(RENDER_NEXT_STAGE),
    renderPreviousStage: () => handleRenderStage(RENDER_PREV_STAGE),
  };
}
