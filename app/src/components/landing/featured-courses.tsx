'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { getTrack, type TrackId } from '@/lib/tracks';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, BookOpen, Zap } from 'lucide-react';

interface CourseCardData {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: number;
  xp: number;
  trackId: TrackId;
  slug: string;
  image: string;
}

const FEATURED_COURSES: CourseCardData[] = [
  {
    title: 'Solana Fundamentals',
    description: 'Understand accounts, transactions, and the Solana runtime from first principles.',
    difficulty: 'Beginner',
    lessons: 5,
    xp: 250,
    trackId: '1',
    slug: 'solana-101',
    image: '/images/courses/solana-101.svg',
  },
  {
    title: 'Building a DEX with Anchor',
    description: 'Create a fully functional decentralized exchange with order books and AMM pools.',
    difficulty: 'Intermediate',
    lessons: 8,
    xp: 600,
    trackId: '2',
    slug: 'defi-201',
    image: '/images/courses/defi-201.svg',
  },
  {
    title: 'NFT Collections with Metaplex',
    description: 'Mint, manage, and trade NFT collections using the Metaplex Core standard.',
    difficulty: 'Intermediate',
    lessons: 7,
    xp: 525,
    trackId: '3',
    slug: 'nft-201',
    image: '/images/courses/nft-201.svg',
  },
  {
    title: 'Smart Contract Auditing',
    description: 'Master security patterns and learn to identify common Solana program vulnerabilities.',
    difficulty: 'Advanced',
    lessons: 8,
    xp: 800,
    trackId: '4',
    slug: 'sec-301',
    image: '/images/courses/sec-301.svg',
  },
];

const DIFFICULTY_CLASS: Record<CourseCardData['difficulty'], string> = {
  Beginner: 'bg-leaf/20 text-green-deep dark:text-leaf',
  Intermediate: 'bg-gold/20 text-clay-deep dark:text-gold',
  Advanced: 'bg-rust/15 text-rust-deep dark:text-rust-bright',
};

export function FeaturedCourses() {
  const t = useTranslations('landing');

  return (
    <section
      className="py-16 md:py-24"
      aria-labelledby="featured-courses-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            Curated Curriculum
          </span>
          <h2
            id="featured-courses-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {t('featured_courses')}
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Hands-on courses designed by Solana ecosystem builders. Each course
            rewards you with on-chain XP and verifiable credentials.
          </p>
        </div>

        {/* Course grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_COURSES.map((course) => {
            const track = getTrack(course.trackId);
            return (
              <Link
                key={course.title}
                href={`/courses/${course.slug}`}
                className="group block h-full"
              >
                <Card className="relative h-full overflow-hidden border-2 border-brown/10 transition-all duration-200 hover:border-skyblue/30 hover:shadow-md group-hover:scale-[1.01]">
                  {/* Gradient image placeholder */}
                  <div
                    className={cn(
                      'relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br',
                      track.tintGradient,
                    )}
                  >
                    {course.image ? (
                      <Image
                        src={course.image}
                        alt=""
                        width={800}
                        height={128}
                        className="absolute inset-0 h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <track.Icon className="h-10 w-10 text-foreground/20" />
                    )}
                    {/* XP badge */}
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                      <Zap className="h-3 w-3 text-clay-deep dark:text-gold" />
                      {course.xp.toLocaleString()} XP
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-[10px] font-semibold',
                          DIFFICULTY_CLASS[course.difficulty],
                        )}
                      >
                        {course.difficulty}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-medium',
                          track.badgeClass,
                        )}
                      >
                        {track.name}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 text-base">
                      {course.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {course.description}
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {course.lessons} lessons
                    </p>
                  </CardContent>

                  <CardFooter>
                    <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-primary">
                      Start Course
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* View all link */}
        <div className="mt-10 flex justify-center">
          <Button variant="outline" size="lg" className="gap-2" asChild>
            <Link href="/courses">
              View All Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
