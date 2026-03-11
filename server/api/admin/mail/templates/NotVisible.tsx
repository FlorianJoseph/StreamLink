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

const baseUrl = "https://stream-link.fr";

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
                            buttonBg: "#7c3aed",
                        },
                    },
                },
            }}
        >
            <Body className="font-sans m-0 p-0">
                <Container className="mx-auto max-w-[560px] border border-zinc-800">

                    {/* Header */}
                    <Section className="bg-zinc-900 border-b border-zinc-800 px-8 py-5">
                        <Text className="text-white text-xl font-bold tracking-tight m-0">
                            StreamLink
                        </Text>
                    </Section>

                    {/* Hero */}
                    <Section className="bg-zinc-900 p-7">
                        <Text className="text-white text-sm font-semibold mt-0 mb-1">
                            Salut {username},
                        </Text>
                        <Heading className="text-white text-2xl font-bold tracking-tight mt-0 mb-3">
                            Ton profil est encore invisible
                        </Heading>
                        <Text className="text-zinc-400 text-sm leading-relaxed mt-0 mb-6">
                            Tu es inscrit sur StreamLink, mais ton profil n'apparaît pas encore sur la page Découverte.
                            <br /><br />
                            Résultat : les viewers et autres streamers ne peuvent pas te trouver. C'est dommage, surtout quand ça ne prend que <strong>moins de 2 minutes</strong> à changer.
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
                    <Section className="px-8 py-7" style={{ backgroundColor: "#121212" }}>
                        <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mt-0 mb-5">
                            Pourquoi activer la visibilité ?
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
                                    Apparaître sur la page Découverte
                                </Text>
                                <Text className="text-zinc-400 text-xs leading-relaxed m-0">
                                    Chaque jour, des streamers et des viewers découvrent de nouveaux streamers sur cette page. Sans visibilité, tu n'y es tout simplement pas.
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
                                    Partager un seul lien pour tout
                                </Text>
                                <Text className="text-zinc-400 text-xs leading-relaxed m-0">
                                    Ton profil StreamLink regroupe tous tes liens, ton planning et ton identité. Un seul lien à donner, partout.
                                </Text>
                            </Column>
                        </Row>
                    </Section>

                    <Hr className="border-zinc-800 m-0" />

                    {/* Discord */}
                    <Section className="bg-zinc-900 px-8 py-7 text-center">
                        <table width="100%">
                            <tr>
                                <td align="center" style={{ verticalAlign: "middle" }}>
                                    <table>
                                        <tr>
                                            <td className="pr-[4px]" style={{ verticalAlign: "middle" }}>
                                                <Img
                                                    src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/users.png"
                                                    width="20"
                                                    alt=""
                                                />
                                            </td>
                                            <td style={{ verticalAlign: "middle" }}>
                                                <Text className="text-discordText text-base font-semibold m-0">
                                                    Rejoins la communauté
                                                </Text>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <Text className="text-zinc-400 text-sm leading-relaxed mt-3 mb-5">
                            Des questions sur StreamLink ? Viens en parler directement avec l'équipe et les autres streamers sur Discord.
                        </Text>
                        <table width="100%">
                            <tr>
                                <td align="center">
                                    <Button
                                        className="box-border w-full rounded-[8px] bg-discordBg px-[16px] py-[8px]"
                                        href="https://discord.gg/fVFguWc76b">
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
                    <Section className="px-8 py-6 text-center" style={{ backgroundColor: "#121212" }}>
                        <Text className="text-zinc-600 text-xs m-0 mb-2">
                            StreamLink · stream-link.fr
                        </Text>
                        <Text className="text-zinc-600 text-xs m-0">
                            Tu reçois cet email car tu as activé les notifications sur StreamLink.{" "}
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