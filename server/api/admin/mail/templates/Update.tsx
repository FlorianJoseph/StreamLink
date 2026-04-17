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

interface Feature {
    title: string;
    icon?: string;
    details?: string[];
}

interface UpdateEmailProps {
    updateTitle?: string;       // ex: "Mise à jour de mars"
    previewText?: string;    // ex: "3 nouvelles fonctionnalités"
    features?: Feature[];
}

const defaultFeatures: Feature[] = [
    {
        title: "Raids avec récompenses",
        icon: "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/coins.png",
        details: [
            "Gagne des Coins à chaque raid",
            "Raid un streamer compatible en 2 clics",
            "Les petits streamers te rapportent plus de Coins",
            "Utilise tes Coins pour débloquer des fonctionnalités",
            "Apparais dans le Top Raiders en raidant régulièrement",
        ],
    },
    {
        title: "Trouve des streamers faits pour toi",
        icon: "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/users.png",
        details: [
            "Streamers classés par genre : FPS, RPG, IRL, Survie, Battle Royale...",
            "Vois directement les lives sans quitter le site",
            "Trouve des streamers compatibles en quelques secondes",
        ],
    },
];

const DEFAULT_ICON = "https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/sparkles.png";

export const UpdateEmail = ({
    username,
    updateTitle = "Transforme tes raids en récompenses",
    previewText = "Raid des streamers, gagne des Coins, et boost ta visibilité.",
    features = defaultFeatures,
}: UpdateEmailProps & { username: string }) => (
    <Html>
        <Head />
        <Preview>{previewText}</Preview>
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
                        <Heading className="text-white text-xl font-bold tracking-tight mt-0 mb-2">
                            {updateTitle}
                        </Heading>
                        <Text className="text-zinc-400 text-sm mt-2 mb-0">
                            Les raids sont maintenant récompensés et boostent ta visibilité.
                        </Text>
                    </Section>

                    <Hr className="border-zinc-800 m-0" />

                    {/* Liste des features */}
                    <Section className="px-8 py-7" style={{ backgroundColor: "#121212" }}>
                        <Text className="text-purple-400 text-xs font-semibold uppercase tracking-widest m-0 mb-5">
                            ✦ Nouveautés
                        </Text>

                        {features.map((feature, index) => (
                            <Row key={index} className={index < features.length - 1 ? "mb-6" : "mb-5"}>
                                <Column className="w-9 align-top pt-0.5">
                                    <Img
                                        src={feature.icon ?? DEFAULT_ICON}
                                        width="24"
                                        alt=""
                                    />
                                </Column>
                                <Column className="align-top">
                                    <Text className="text-white text-sm font-semibold m-0 mb-1">
                                        {feature.title}
                                    </Text>
                                    {feature.details?.map((detail, i) => (
                                        <Text key={i} className="text-zinc-400 text-xs leading-relaxed m-0">
                                            - {detail}
                                        </Text>
                                    ))}
                                </Column>
                            </Row>
                        ))}
                        <table width="100%">
                            <tr>
                                <td align="center">
                                    <Button
                                        className="box-border w-full rounded-[8px] bg-buttonBg px-[16px] py-[8px]"
                                        href={`${baseUrl}/discover?utm_source=email&utm_campaign=raids_launch`}>
                                        <table>
                                            <tr>
                                                <td className="pr-[4px] pt-[2px]">
                                                    <Img
                                                        src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/public/Streamlink/NewsletterIcon/coins.png"
                                                        width="20"
                                                        alt=""
                                                    />
                                                </td>
                                                <td>
                                                    <span className="text-white text-sm font-semibold">
                                                        Lancer mon premier raid
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
                                                    Une idée ? Un retour ?
                                                </Text>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <Text className="text-zinc-400 text-sm leading-relaxed mt-3 mb-5">
                            Viens donner ton avis sur ces nouveautés et influencer les prochaines fonctionnalités directement sur Discord.
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

export default UpdateEmail;