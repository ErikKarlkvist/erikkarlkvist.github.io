import { Carousel } from '../components/explore/Carousel';
import { MinimalisticDemo } from '../components/explore/minimalistic/MinimalisticDemo';
import { ModernDemo } from '../components/explore/modern/ModernDemo';
import { ColorfulDemo } from '../components/explore/colorful/ColorfulDemo';

export default function ExploreComponents() {
    const items = [
        {
            id: 'minimal',
            theme: 'minimalistic' as const,
            component: <MinimalisticDemo />
        },
        {
            id: 'modern',
            theme: 'modern' as const,
            component: <ModernDemo />
        },
        {
            id: 'colorful',
            theme: 'colorful' as const,
            // Temporarily wrapping ColorfulDemo since we haven't extracted it yet
            component: <ColorfulDemo />
        }
    ];

    return <Carousel items={items} />;
}
