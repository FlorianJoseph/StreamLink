import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Link,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Row,
    Column,
    Tailwind,
} from "@react-email/components";

const baseUrl = "https://charmi.gg";

const features = [
    { label: "Badge vérifié sur la Découverte" },
    { label: "6 Charm/jour automatiquement" },
    { label: "13 thèmes et 23 polices exclusifs" },
    { label: "Planning en story pour tes réseaux" },
    { label: "Masque le logo Charmi sur ton profil et planning" },
];

export const CharmiPlusEmail = ({ username }: { username: string }) => (
    <Html>
        <Head />
        <Preview>Essaie Charmi+ gratuitement pendant 7 jours, sans engagement.</Preview>
        <Tailwind
            config={{
                theme: {
                    extend: {
                        colors: {
                            discordBg: "#5865f2",
                            discordText: "#e0e3ff",
                            buttonBg: "#6A5AE0",
                            accentYellow: "#FFC82C",
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
                    <Section className="bg-[#2A2B2F] p-8">
                        <Text className="text-white text-sm font-semibold mt-0 mb-1">
                            Salut {username},
                        </Text>
                        <Heading className="text-white text-2xl font-bold tracking-tight mt-0 mb-2" style={{ lineHeight: "1.2" }}>
                            Charmi+ est disponible.
                        </Heading>
                        <Text className="text-zinc-400 text-sm leading-relaxed mt-0 mb-0">
                            Tu peux l'essayer gratuitement pendant 7 jours, sans engagement.
                        </Text>
                    </Section>

                    <Hr className="border-zinc-800 m-0" />

                    {/* Features */}
                    <Section className="px-8 py-7" style={{ backgroundColor: "#1E1F22" }}>
                        <Text className="text-purple-400 text-xs font-semibold uppercase tracking-widest m-0 mb-5">
                            ✦ Ce que ça débloque
                        </Text>

                        {features.map((feature, index) => (
                            <Row key={index} className="mb-3">
                                <Column className="w-6 align-top pt-0.5">
                                    <Text className="text-[#FFC82C] text-sm font-bold m-0">✦</Text>
                                </Column>
                                <Column className="align-top">
                                    <Text className="text-white text-sm m-0">
                                        {feature.label}
                                    </Text>
                                </Column>
                            </Row>
                        ))}

                        <Text className="text-zinc-400 text-xs leading-relaxed mt-5 mb-6">
                            D'autres features arrivent prochainement : stats avancées, sync Twitch, export Discord.
                            <br></br> Tout sera inclus dans Charmi+ dès leur sortie.
                        </Text>

                        {/* CTA */}
                        <table width="100%">
                            <tr>
                                <td align="center">
                                    <Button
                                        className="box-border w-full rounded-[8px] bg-buttonBg px-[16px] py-[10px]"
                                        href={`${baseUrl}/shop?utm_source=email&utm_campaign=charmiplus_launch`}
                                    >
                                        <span className="text-white text-sm font-semibold">
                                            Essayer Charmi+ gratuitement
                                        </span>
                                    </Button>
                                </td>
                            </tr>
                        </table>

                        <Text className="text-zinc-500 text-xs text-center mt-3 mb-0">
                            7 jours gratuits puis 7,99€/mois · Paiement sécurisé · Annulation à tout moment
                        </Text>
                    </Section>

                    <Hr className="border-zinc-800 m-0" />

                    {/* Discord */}
                    <Section className="bg-[#2A2B2F] px-8 py-7 text-center">
                        <Text className="text-white text-sm font-semibold m-0 mb-2">
                            Une question ? Un retour ?
                        </Text>
                        <Text className="text-zinc-400 text-sm leading-relaxed mt-2 mb-5">
                            Passe sur Discord, je suis là pour répondre.
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
                        <Text className="text-zinc-400 text-sm leading-relaxed m-0" style={{ fontStyle: "italic" }}>
                            "C'est ce qui permettra au projet de continuer à grandir."
                        </Text>
                        <Text className="text-zinc-500 text-xs mt-2 mb-4">
                            NordiK, créateur de Charmi
                        </Text>
                        <Text className="text-zinc-600 text-xs m-0 mb-4">
                            <Link href="https://tiktok.com/@charmicompanion" className="text-zinc-500 underline">Charmi sur TikTok</Link>
                            {" · "}
                            <Link href="https://instagram.com/charmicompanion" className="text-zinc-500 underline">Charmi sur Instagram</Link>
                        </Text>
                        <Hr className="border-zinc-800 mb-4" />
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

export default CharmiPlusEmail;