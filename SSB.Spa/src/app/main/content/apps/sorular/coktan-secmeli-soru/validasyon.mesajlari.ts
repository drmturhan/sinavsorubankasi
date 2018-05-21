
export function CoktanSecmeliSoruValidasyonMesajlari_tr() {
    return {

        // kaynakca: {
        //     required: 'Soru adı alanına bilgi girilmesi gerekli.',
        //     minlength: 'En az 3 karakter olmalıdır.',
        //     maxlength: 'En fazla 200 karakter olmalıdır.'
        // },
        soruBelgesi: {
            required: 'Soru belgesi alanına bilgi girilmesi gerekli.',
            minlength: 'En az 3 karakter olmalıdır.'
        },
        baslangic: {
            required: 'Başlangıç tarihi alanına bilgi girilmesi gerekli.'
        },
        gecerlilik: {
            bitisbaslangictanonceolamaz: 'Başlangıç tarihi bitiş tarihinden sonra olamaz.'
        },
        // aciklama: {
        //     required: 'Açıklama alanına bilgi girilmesi gerekli.',
        //     minlength: 'En az 3 karakter olmalıdır.',
        //     maxlength: 'En fazla 500 karakter olmalıdır.'
        // },
        anahtarKelimeler: {
            required: 'Anahtar kelimeler alanına bilgi girilmesi gerekli.',
        },
        soruTipNo: {
            required: 'Soru tipini seçmediniz.',
        },

        soruZorlukNo: {
            required: 'Soru zorluk derecesini seçmediniz.',
        },
        bilisselDuzeyNo: {
            required: 'Bilişsel düzeyi seçmediniz.',
        },
        tekDogruluSecenekleri: {
            hicSecenekGirilmemis: 'Seçenek girilmemiş.',
            secenekMetniBos: 'Seçenek metinleri boş olamaz.',
            tekDogruSecenekOlabilir: 'Sadece bir doğru seçenek olabilir.',
            dogruSecenekGirilmemis: 'Bir doğru seçenek belirlemeniz gerekli.'
        }
    };
}

