import { Box, Flex, Text, Heading, Badge } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { Footer } from "@/app/components/footer";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import LightRays from "@/app/components/light-rays";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div
      data-hide-navbar-border="true"
      className="flex min-h-full flex-col min-w-80"
    >
      <Box className="dark:invisible absolute inset-4 -z-10 bg-linear-to-tr from-blue-500/10 via-orange-500/5 to-emerald-400/15 blur-3xl" />
      <Box className="invisible dark:visible fixed inset-0 -z-10 w-screen h-dvh overflow-hidden pointer-events-none">
        <LightRays
          className="w-full h-full custom-rays"
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </Box>
      <Flex
        direction="column"
        align="center"
        justify="center"
        className="px-6 pt-36 pb-24 text-center"
      >
        <Image
          width={100}
          height={100}
          alt="appicon"
          src="/favicon.ico"
          className="w-16 sm:w-20 md:w-24"
        />

        <Badge
          size="2"
          variant="surface"
          color="gray"
          radius="full"
          className="mt-1 mb-5"
        >
          Assign. Track. Complete.
        </Badge>

        <Heading
          as="h1"
          size="8"
          weight="bold"
          className="text-4xl sm:text-5xl md:text-7xl"
        >
          Oppdragsportalen
        </Heading>

        <Box className="my-4">
          <Text
            as="p"
            size="3"
            color="gray"
            className="max-w-md text-sm sm:text-base md:text-lg"
          >
            An open-source assignment management platform. Create, assign, and
            track assignments instantly.
          </Text>
        </Box>

        <Flex
          gap="3"
          justify="center"
          wrap="wrap"
          className="sticky top-4 z-10"
        >
          <Button asChild size="lg" variant="default">
            <Link href="/signup">
              Get started
              <ArrowRightIcon />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" color="gray">
            <Link href="/login">Log in</Link>
          </Button>
        </Flex>

        <Box className="slide-up relative mt-20 md:mt-24 w-full">
          <Box className="slide-up absolute max-w-7xl m-auto inset-x-8 top-10 bottom-0 -z-10 bg-linear-to-tr from-blue-500/50 via-orange-500/20 to-emerald-400/50 blur-3xl shadow-[0_20px_70px_-15px_rgba(0,0,0,0.6)]" />
          <Box className="slide-up relative w-screen left-1/2 overflow-hidden -translate-x-1/2 md:static md:w-full md:left-auto md:translate-x-0 md:overflow-visible">
            <Box
              className="group relative w-155 ml-6 my-2
              sm:w-205 md:mx-auto! md:ml-0 md:w-full md:max-w-6xl
              animate-in fade-in slide-in-from-bottom-6 ease-out
              rounded-2xl border border-white/10 bg-white/3
              ring-5 md:ring-8 ring-black/5 overflow-hidden
              transition-transform duration-500 will-change-transform
              md:hover:-translate-y-3"
            >
              <Box className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />

              <Image
                src="/dashboard-preview-dark.png"
                alt="Oppdragsportalen dashboard preview"
                width={2412}
                height={1512}
                priority
                sizes="(max-width: 768px) 820px, 1024px"
                className="hidden dark:block w-full h-auto select-none"
              />

              <Image
                src="/dashboard-preview-light.png"
                alt="Oppdragsportalen dashboard preview"
                width={2412}
                height={1512}
                priority
                sizes="(max-width: 768px) 820px, 1024px"
                className="block dark:hidden w-full h-auto select-none"
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-(--color-background,black)/80 to-transparent" />
            </Box>
          </Box>
        </Box>
      </Flex>
      <Footer />
    </div>
  );
}
