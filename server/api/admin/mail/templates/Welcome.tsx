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

export const Welcome = ({ username }: { username: string }) => (
    <Html>
        <Head />
        <Preview>2 étapes pour être visible</Preview>
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
                        <Heading className="text-white text-2xl font-bold tracking-tight mt-0 mb-3">
                            Bienvenue {username},
                        </Heading>
                        <Text className="text-zinc-400 text-sm leading-relaxed mt-0 mb-6">
                            StreamLink, ta plateforme tout-en-un : liens, planning, identité… tout prêt à partager.
                            <br /><br />
                            Complète ton profil pour apparaître sur la page Découverte et être trouvé par d'autres streamers et viewers.
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
                                                        src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/eye.png"
                                                        width="20"
                                                        alt=""
                                                    />
                                                </td>
                                                <td>
                                                    <span className="text-white text-sm font-semibold">
                                                        Rendre mon profil visible
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

                    {/* Steps */}
                    <Section className="px-8 py-7" style={{ backgroundColor: "#121212" }}>
                        <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mt-0 mb-5">
                            Par où commencer ?
                        </Text>

                        {/* Step 1 */}
                        <Row className="mb-5">
                            <Column className="w-9 align-top pt-0.5">
                                <Img
                                    src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/link.png"
                                    width="24"
                                    alt=""
                                />
                            </Column>
                            <Column className="align-top">
                                <Text className="text-white text-sm font-semibold m-0 mb-1">
                                    Ajoute tes liens
                                </Text>
                                <Text className="text-zinc-400 text-xs leading-relaxed m-0">
                                    Twitch, YouTube, Discord, réseaux... regroupe tout au même endroit.
                                </Text>
                            </Column>
                        </Row>

                        {/* Step 2 */}
                        <Row>
                            <Column className="w-9 align-top pt-0.5">
                                <Img
                                    src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/calendar-days.png"
                                    width="24"
                                    alt=""
                                />
                            </Column>
                            <Column className="align-top">
                                <Text className="text-white text-sm font-semibold m-0 mb-1">
                                    Configure ton planning
                                </Text>
                                <Text className="text-zinc-400 text-xs leading-relaxed m-0">
                                    Indique à ta communauté quand tu stream. C'est le moyen le plus
                                    simple de gagner en visibilité.
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
                            Viens influencer les prochaines features, échanger avec d'autres streamers
                            et suivre la roadmap en direct.
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

                    {/* Footer */}
                    <Section className="px-8 py-6 text-center" style={{ backgroundColor: "#121212" }}>
                        <Text className="text-zinc-600 text-xs m-0 mb-2">
                            StreamLink · stream-link.fr
                        </Text>
                        <Text className="text-zinc-600 text-xs">
                            Vous recevez cet email car vous avez créé un compte sur StreamLink.
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Tailwind>
    </Html>
);

export default Welcome;