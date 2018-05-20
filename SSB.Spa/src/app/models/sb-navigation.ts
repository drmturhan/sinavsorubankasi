export class SbNavitaionItem {
    id: string;
    title: string;
    type: string;
    icon: string;
    translate: string;
    url: string;
    badge: SbNavigationBadge;
    exactMatch: boolean;
    children: SbNavitaionItem[];

    constructor() {
        this.children = [];
    }
}
export class SbNavigationBadge {
    title: string;
    translate: string;
    bg: string;
    fg: string;
}
