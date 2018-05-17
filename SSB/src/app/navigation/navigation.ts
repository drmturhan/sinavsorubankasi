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
                'icon': 'dashboard',
                'children': [{
                    'id': 'sorularim',
                    'title': 'Sorularım',
                    'type': 'item',
                    'icon': 'email',
                    'url': 'sorudeposu',
                    'badge': {
                        'title': 13,
                        'bg': '#EC0C8E',
                        'fg': '#FFFFFF'
                    }
                }]
            }
        ]
    }

];

