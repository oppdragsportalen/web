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
      <Box className="invisible dark:visible fixed inset-0 -z-10 w-screen h-screen overflow-hidden pointer-events-none">
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
        className="px-6 pt-40 pb-24 text-center"
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
            A simple platform for organizing work. Create, assign, and track
            assignments instantly.
          </Text>
        </Box>

        <Flex gap="3" justify="center" wrap="wrap">
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
      </Flex>
      <Footer />
    </div>
  );
}
