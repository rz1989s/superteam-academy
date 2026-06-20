'use client';

import { useCourseStore } from '@/lib/stores/course-store';
import type { CourseWithMeta, CourseFilters, CourseState } from '@/lib/stores/course-store';
import { useUserStore } from '@/lib/stores/user-store';
import type { EnrollmentData } from '@/lib/stores/user-store';

interface UseCourseReturn {
  course: CourseWithMeta | null;
  enrollment: EnrollmentData | null;
  isEnrolled: boolean;
  isLoading: boolean;
}

/**
 * Resolves a single course by ID from the loaded catalog and pairs it with
 * the current user's enrollment for that course.
 *
 * The course is derived read-only from the store's `courses` list, so
 * multiple consumers on the same page (e.g. a course and its prerequisite
 * card) each resolve their OWN course without writing to — and clobbering —
 * a shared selected-course value. Returns `null` when `courseId` is omitted
 * or the matching course isn't loaded.
 */
export function useCourse(courseId?: string): UseCourseReturn {
  const course = useCourseStore((s) =>
    courseId ? s.courses.find((c) => c.courseId === courseId) ?? null : null,
  );
  const courseLoading = useCourseStore((s) => s.isLoading);

  const enrollments = useUserStore((s) => s.enrollments);
  const userLoading = useUserStore((s) => s.isLoading);

  const enrollment = courseId ? enrollments.get(courseId) ?? null : null;

  return {
    course,
    enrollment,
    isEnrolled: enrollment !== null,
    isLoading: courseLoading || userLoading,
  };
}

// ---------------------------------------------------------------------------

interface UseCourseListReturn {
  courses: CourseWithMeta[];
  filteredCourses: CourseWithMeta[];
  filters: CourseFilters;
  setFilter: CourseState['setFilter'];
  resetFilters: () => void;
  isLoading: boolean;
}

/**
 * Provides the full course catalog from the course store with
 * filtering and sorting capabilities.
 *
 * `filteredCourses` recomputes on every render from the store's
 * `getFilteredCourses()` — this is intentional since Zustand selectors
 * won't detect changes to the computed output (it's a getter, not state).
 */
export function useCourseList(): UseCourseListReturn {
  const courses = useCourseStore((s) => s.courses);
  const filters = useCourseStore((s) => s.filters);
  const setFilter = useCourseStore((s) => s.setFilter);
  const resetFilters = useCourseStore((s) => s.resetFilters);
  const isLoading = useCourseStore((s) => s.isLoading);
  const getFilteredCourses = useCourseStore((s) => s.getFilteredCourses);

  // getFilteredCourses reads from store state internally — call it
  // on each render so filtered results stay in sync with filter changes.
  const filteredCourses = getFilteredCourses();

  return {
    courses,
    filteredCourses,
    filters,
    setFilter,
    resetFilters,
    isLoading,
  };
}
