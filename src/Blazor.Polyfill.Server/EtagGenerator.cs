using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blazor.Polyfill.Server
{
    public static class EtagGenerator
    {
        private static string CreateMD5(string input)
        {
            // Use input string to calculate MD5 hash
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                // Convert the byte array to hexadecimal string
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("X2"));
                }
                return sb.ToString().ToLowerInvariant();
            }
        }

        public static string GenerateEtagFromString(string content)
        {
            if (string.IsNullOrEmpty(content))
            {
                throw new NullReferenceException(nameof(content));
            }

            //First we calculate the MD5 hash from the file content.
            //If the file did not changed between app reboot, it should
            //return the same value.
            string md5 = CreateMD5(content);

            return $"\"{md5}\"";
        }
    }
}
