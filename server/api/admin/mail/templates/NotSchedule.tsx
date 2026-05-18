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

export const NotScheduleEmail = ({ username }: { username: string }) => (
    <Html>
        <Head />
        <Preview>Ton prochain stream est quand ? Dis-le à ta communauté</Preview>
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
                            Ton prochain stream est quand ?
                        </Heading>
                        <Text className="text-zinc-400 text-sm leading-relaxed mt-0 mb-6">
                            Ton planning est encore vide. Sans horaires, ta communauté ne sait pas quand te retrouver en live et ça se règle en <strong>moins de 2 minutes</strong>.
                        </Text>

                        <table width="100%">
                            <tr>
                                <td align="center">
                                    <Button
                                        className="box-border w-full rounded-[8px] bg-buttonBg px-[16px] py-[8px]"
                                        href={`${baseUrl}/schedule`}>
                                        <table>
                                            <tr>
                                                <td className="pr-[4px] pt-[2px]">
                                                    <Img
                                                        src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/calendar-days.png"
                                                        width="20"
                                                        alt=""
                                                    />
                                                </td>
                                                <td>
                                                    <span className="text-white text-sm font-semibold">
                                                        Créer mon planning
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

                    {/* Pourquoi un planning */}
                    <Section className="px-8 py-7" style={{ backgroundColor: "#1E1F22" }}>
                        <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mt-0 mb-5">
                            Pourquoi ajouter mon planning ?
                        </Text>

                        {/* Raison 1 */}
                        <Row className="mb-5">
                            <Column className="w-9 align-top pt-0.5">
                                <Img
                                    src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/heart.png"
                                    width="24"
                                    alt=""
                                />
                            </Column>
                            <Column className="align-top">
                                <Text className="text-white text-sm font-semibold m-0 mb-1">
                                    Fidélise ta communauté
                                </Text>
                                <Text className="text-zinc-400 text-xs leading-relaxed m-0">
                                    Un planning régulier, c'est ce qui transforme des viewers de passage en abonnés fidèles. Ils savent quand revenir.
                                </Text>
                            </Column>
                        </Row>

                        {/* Raison 2 */}
                        <Row className="mb-5">
                            <Column className="w-9 align-top pt-0.5">
                                <Img
                                    src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/swords.png"
                                    width="24"
                                    alt=""
                                />
                            </Column>
                            <Column className="align-top">
                                <Text className="text-white text-sm font-semibold m-0 mb-1">
                                    Fais-toi raid
                                </Text>
                                <Text className="text-zinc-400 text-xs leading-relaxed m-0">
                                    Charmi repère les streamers qui live en même temps que toi. Ton planning, c'est ce qui rend ça possible.
                                </Text>
                            </Column>
                        </Row>

                        {/* Raison 3 */}
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
                                    Affiché sur ta page de liens
                                </Text>
                                <Text className="text-zinc-400 text-xs leading-relaxed m-0">
                                    Ton planning apparaît directement sur ta page de liens. Tes visiteurs voient tes horaires dès qu'ils cliquent sur ton lien.
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
                            Partage ton planning, trouve des streamers compatibles, et organise tes prochains raids.
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

export default NotScheduleEmail;