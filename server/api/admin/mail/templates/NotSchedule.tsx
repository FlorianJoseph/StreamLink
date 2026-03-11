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
                            Ton prochain stream est quand ?
                        </Heading>
                        <Text className="text-zinc-400 text-sm leading-relaxed mt-0 mb-6">
                            Ton planning StreamLink est encore vide. Sans horaires, ta communauté ne sait pas quand te retrouver en live.
                            <br /><br />
                            Ajoute tes jours et horaires habituels, ça prend <strong>moins de 2 minutes</strong> et ça change tout pour ta visibilité.
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
                    <Section className="px-8 py-7" style={{ backgroundColor: "#121212" }}>
                        <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mt-0 mb-5">
                            Pourquoi configurer son planning ?
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
                                    src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/eye.png"
                                    width="24"
                                    alt=""
                                />
                            </Column>
                            <Column className="align-top">
                                <Text className="text-white text-sm font-semibold m-0 mb-1">
                                    Augmente ta visibilité sur StreamLink
                                </Text>
                                <Text className="text-zinc-400 text-xs leading-relaxed m-0">
                                    Les profils avec un planning sont mis en avant sur la page Découverte. Cela permet à de nouveaux viewers de te trouver plus facilement.
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
                                    Ton planning apparaît directement sur ta page publique StreamLink. Tes viewers voient tes horaires dès qu'ils cliquent sur ton lien.
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
                            Viens échanger avec d'autres streamers, partager tes horaires et suivre les nouveautés StreamLink en direct.
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

export default NotScheduleEmail;