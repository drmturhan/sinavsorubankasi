using Core.EntityFramework.SharedEntity;

namespace Identity.DataAccess
{
    public class Mesaj : Mesaj<int>
    {

        public Kullanici Gonderen { get; set; }
        public Kullanici Alan { get; set; }

    }
}
