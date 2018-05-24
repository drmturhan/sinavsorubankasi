export const navigation = [
    {
        'id': 'uygulamalar',
        'title': 'Uygulamalar',

        'type': 'group',
        'icon': 'apps',
        'children': [
            {
                'id': 'anasayfa',
                'title': 'Anasayfa',
                'type': 'item',
                'icon': 'home',
                'url': 'anasayfa'
            },

            {
                'id': 'sorudeposu',
                'title': 'Soru Deposu',
                'type': 'collapse',
                'icon': 'sd_card',
                'children': [
                    {
                        'id': 'sorularim',
                        'title': 'Sorularım',
                        'type': 'item',
                        'icon': 'view_list',
                        'url': 'sorudeposu',
                        'badge': {
                            'title': 13,
                            'bg': '#EC0C8E',
                            'fg': '#FFFFFF'
                        }
                    },
                    {
                        'id': 'ngrxmail',
                        'title': 'Mails',
                        'type': 'item',
                        'icon': 'email',
                        'url': 'mail',
                        'badge': {
                            'title': 13,
                            'bg': '#EC0C8E',
                            'fg': '#FFFFFF'
                        }
                    }
                ]
            }
        ]
    }

];

