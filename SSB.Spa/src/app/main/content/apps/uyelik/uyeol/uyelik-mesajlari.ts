export function UyelikBasvuruValidasyonMesajlariTr() {
    return {
        kullaniciAdi: {
            required: 'Kullanıcı adı alanına bilgi girilmesi gerekli.',
            minlength: 'En az 3 karakter olmalıdır.',
            maxlength: 'En fazla 20 karakter olmalıdır.',
            boslukIceremez: 'Kullanıcı adı boşluk içermez.',
            harfRakamDisiNesneVar: 'Kullanıcı adı sadece ingizlice harfler ve rakamlardan oluşabilir.'


        },
        unvan: {
            minlength: 'En az 2 karakter olmalıdır.',
            maxlength: 'En fazla 15 karakter olmalıdır.'
        },
        ad: {
            required: 'Ad alanına bilgi girilmesi gerekli.',
            minlength: 'En az 2 karakter olmalıdır.',
            maxlength: 'En fazla 50 karakter olmalıdır.'
        },
        digerAd: {
            minlength: 'En az 2 karakter olmalıdır.',
            maxlength: 'En fazla 50 karakter olmalıdır.'
        },
        soyad: {
            required: 'Soyad alanına bilgi girilmesi gerekli.',
            minlength: 'En az 2 karakter olmalıdır.',
            maxlength: 'En fazla 50 karakter olmalıdır.'
        },
        cinsiyetNo: {
            required: 'Cinsiyet alanına bilgi girilmesi gerekli.'
        },
        dogumTarihi: {
            required: 'Doğum tarihi alanına bilgi girilmesi gerekli.'

        },
        ePosta: {
            required: 'Eposta  girmediniz.',
            email: 'Geçerli bir eposta adresi girmeliniz.',
            epostaKullaniliyor: 'Eposta adresi kullanılıyor. Başka deneyin....'
        },
        telefonNumarasi: {
            required: 'Telefon numarası girmediniz.',
            maxlength: 'Telefon numarası en az 2 an fazla 15 rakamdan oluşabilir.',
            telefonNumarasiYanlis: 'Telefon numarası yanlış.',
            sifirlaBasliyor: 'Sadece alan kodu (3X) ve numara(7X) giriniz.'
        },
        sifre: {
            required: 'Şifre girmediniz.',
            minlength: 'En az 6 karakter olmalıdır.',
            sifreGucluDegil: 'Lütfen en az bir büyük harf, bir küçük harf, bir rakam ve bir alfanumeraik OLMAYAN karakter girin.',
            maxlength: 'En fazla 18 karakter olmalıdır.'
        },
        sifreKontrol: {
            required: 'Şifre kontrol girmediniz.',
        },
        sifreGrup: {
            sifreKontrolBasarisiz: 'Şifre ile şifre kontrol aynı olmalıdır.'
        },
        sartlariKabulEdiyorum: {
            required: 'Kullanım şartları gerekli alan.',
            kullanimSartlariniKabulEtmiyor: 'Kullanım şartlarını kabul etmeden üye olamazsınız'
        }
    };
}




export function UyelikBasvuruValidasyonMesajlariEn() {
    return {
        kullaniciAdi: {
            required: 'Username is required.',
            minlength: 'It should be at least 3 characters.',
            maxlength: 'More than 20 characters are not allowed.',
            boslukIceremez: 'Username does not contain spaces.',
            harfRakamDisiNesneVar: 'The username can only be composed of English letters and numbers.'

        },
        unvan: {
            minlength: 'It should be at least 2 characters.',
            maxlength: 'More than 10 characters are not allowed.'
        },
        ad: {
            required: 'Name is required.',
            minlength: 'It should be at least 2 characters.',
            maxlength: 'More than 50 characters are not allowed.'
        },
        digerAd: {
            minlength: 'It should be at least 2 characters.',
            maxlength: 'More than 50 characters are not allowed.'
        },
        soyad: {
            required: 'The surname field is required.',
            minlength: 'It should be at least 2 characters.',
            maxlength: 'More than 50 characters are not allowed.'
        },
        cinsiyetNo: {
            required: 'The gender field is required.'
        },
        dogumTarihi: {
            required: 'Birth date is required.'

        },
        ePosta: {
            required: 'E-mail is required.',
            email: 'You must enter a valid email address.',
            epostaKullaniliyor: 'Email is used.Please choose another one'
        },
        telefonNumarasi: {
            required: 'Phone number is required.',
            minlength: 'It should be at least 2 characters.',
            maxlength: 'More than 15 characters are not allowed.',
            telefonNumarasiYanlis: 'Phone number is wrong.',
            sifirlaBasliyor: 'Phone number can not start zero.'
        },
        sifre: {
            required: 'Password is reauired.',
            minlength: 'It should be at least 2 characters.',
            sifreGucluDegil: 'Please enter at least one uppercase letter, one lowercase letter, one digit and one non-alphanumeric character.',
            maxlength: 'More than 10 characters are not allowed.'
        },
        sifreKontrol: {
            required: 'Password control is required.',
        },
        sifreGrup: {
            sifreKontrolBasarisiz: 'Password and password control should be the same.'
        },
        sartlariKabulEdiyorum: {
            required: 'Kullanım şartları gerekli alan.',
            kullanimSartlariniKabulEtmiyor: 'Kullanım şartlarını kabul etmeden üye olamazsınız'
        }
    };
}


