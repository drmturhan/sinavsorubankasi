using Core.EntityFramework.SharedEntity;
using System;

namespace Identity.DataAccess
{

    public class KisiFoto : Foto
    {
        public KullaniciKisi Kisi { get; set; }
    }

}
