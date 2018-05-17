using System.Collections.Generic;

namespace Identity.DataAccess
{
    public interface ICinsiyetSecimListesiSaglar
    {
        List<KeyValuePair<string, string>> TumCinsiyetleriAl();
    }
}
