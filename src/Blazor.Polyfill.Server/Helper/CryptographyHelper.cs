using System.Security.Cryptography;
using System.Text;

namespace Blazor.Polyfill.Server.Helper
{
    internal class CryptographyHelper
    {
        /// <summary>
        /// Get SHA256 from string content
        /// https://docs.microsoft.com/fr-fr/dotnet/api/system.security.cryptography.hashalgorithm.computehash?view=net-6.0
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static string CreateSHA256(string input)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // Convert the input string to a byte array and compute the hash.
                byte[] data = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(input));

                // Create a new Stringbuilder to collect the bytes
                // and create a string.
                var sBuilder = new StringBuilder();

                // Loop through each byte of the hashed data
                // and format each one as a hexadecimal string.
                for (int i = 0; i < data.Length; i++)
                {
                    sBuilder.Append(data[i].ToString("x2"));
                }

                // Return the hexadecimal string.
                return sBuilder.ToString();
            }
        }
    }
}
