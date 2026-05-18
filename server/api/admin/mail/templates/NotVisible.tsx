import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Img,
    Preview,
    Section,
    Text,
    Row,
    Column,
    Tailwind,
} from "@react-email/components";

const baseUrl = "https://charmi.gg";

export const NotVisibleEmail = ({ username }: { username: string }) => (
    <Html>
        <Head />
        <Preview>Ton profil est encore invisible</Preview>
        <Tailwind
            config={{
                theme: {
                    extend: {
                        colors: {
                            discordBg: "#5865f2",
                            discordText: "#e0e3ff",
                            buttonBg: "#6A5AE0",
                        },
                    },
                },
            }}
        >
            <Body className="font-sans m-0 p-0 bg-[#141416]">
                <Container className="mx-auto max-w-[560px] border border-zinc-800">

                    {/* Header */}
                    <Section className="bg-[#1E1F22] px-8 py-5">
                        <Img
                            src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/logo.png"
                            width="120"
                            alt=""
                        />
                    </Section>

                    {/* Hero */}
                    <Section className="bg-[#2A2B2F] p-7">
                        <Text className="text-white text-sm font-semibold mt-0 mb-1">
                            Salut {username},
                        </Text>
                        <Heading className="text-white text-2xl font-bold tracking-tight mt-0 mb-3">
                            Ton profil est encore invisible
                        </Heading>
                        <Text className="text-zinc-400 text-sm leading-relaxed mt-0 mb-6">
                            T'es sur Charmi, c'est déjà le bon endroit. Il te reste juste une chose à faire : activer ta visibilité pour que les autres streamers et viewers puissent te trouver. <strong>Moins de 2 minutes</strong>, et t'es visible de tous.
                        </Text>
                        <table width="100%">
                            <tr>
                                <td align="center">
                                    <Button
                                        className="box-border w-full rounded-[8px] bg-buttonBg px-[16px] py-[8px]"
                                        href={`${baseUrl}/dashboard`}>
                                        <table>
                                            <tr>
                                                <td className="pr-[4px] pt-[2px]">
                                                    <Img
                                                        src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/rocket.png"
                                                        width="20"
                                                        alt=""
                                                    />
                                                </td>
                                                <td>
                                                    <span className="text-white text-sm font-semibold">
                                                        Activer ma visibilité
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </Button>
                                </td>
                            </tr>
                        </table>
                    </Section>

                    <Hr className="border-zinc-800 m-0" />

                    {/* Pourquoi être visible */}
                    <Section className="px-8 py-7" style={{ backgroundColor: "#1E1F22" }}>
                        <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mt-0 mb-5">
                            Pourquoi activer ma visibilité ?
                        </Text>

                        {/* Raison 1 */}
                        <Row className="mb-5">
                            <Column className="w-9 align-top pt-0.5">
                                <Img
                                    src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/eye.png"
                                    width="24"
                                    alt=""
                                />
                            </Column>
                            <Column className="align-top">
                                <Text className="text-white text-sm font-semibold m-0 mb-1">
                                    Apparaît sur la page Découverte
                                </Text>
                                <Text className="text-zinc-400 text-xs leading-relaxed m-0">
                                    Sans visibilité, tu n'apparais pas sur la page Découverte. Les autres streamers et viewers ne peuvent pas te trouver.
                                </Text>
                            </Column>
                        </Row>

                        {/* Raison 2 */}
                        <Row>
                            <Column className="w-9 align-top pt-0.5">
                                <Img
                                    src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/link.png"
                                    width="24"
                                    alt=""
                                />
                            </Column>
                            <Column className="align-top">
                                <Text className="text-white text-sm font-semibold m-0 mb-1">
                                    Partage un seul lien pour tout
                                </Text>
                                <Text className="text-zinc-400 text-xs leading-relaxed m-0">
                                    Tous tes liens, ton planning et ton identité en un seul lien à partager partout.
                                </Text>
                            </Column>
                        </Row>
                    </Section>

                    <Hr className="border-zinc-800 m-0" />

                    {/* Discord */}
                    <Section className="px-8 py-7 text-center" style={{ backgroundColor: "#2A2B2F" }}>
                        <Text className="text-white text-sm font-semibold m-0 mb-2">
                            Des streamers t'attendent sur Discord
                        </Text>
                        <Text className="text-zinc-400 text-sm leading-relaxed mt-2 mb-5">
                            Viens te présenter et trouver tes prochains partenaires de raid.
                        </Text>
                        <table width="100%">
                            <tr>
                                <td align="center">
                                    <Button
                                        className="box-border w-full rounded-[8px] bg-discordBg px-[16px] py-[8px]"
                                        href="https://discord.gg/fVFguWc76b"
                                    >
                                        <table>
                                            <tr>
                                                <td className="pr-[4px] pt-[2px]">
                                                    <Img
                                                        src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/discordWhite.png"
                                                        width="20"
                                                        alt=""
                                                    />
                                                </td>
                                                <td>
                                                    <span className="text-discordText text-sm font-semibold">
                                                        Rejoindre le Discord
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </Button>
                                </td>
                            </tr>
                        </table>
                    </Section>

                    <Hr className="border-zinc-800 m-0" />

                    {/* Footer */}
                    <Section className="px-8 py-6 text-center" style={{ backgroundColor: "#1E1F22" }}>
                        <Text className="text-zinc-600 text-xs m-0">
                            Tu reçois cet email car tu as activé les notifications sur Charmi.{" "}
                            <Link href={`${baseUrl}/admin/account`} className="text-zinc-500 underline">
                                Désactiver
                            </Link>
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Tailwind>
    </Html>
);

export default NotVisibleEmail;