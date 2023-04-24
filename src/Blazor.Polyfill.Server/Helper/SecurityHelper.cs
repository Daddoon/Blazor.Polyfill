using Mono.Unix;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Blazor.Polyfill.Server.Helper
{
    internal static class SecurityHelper
    {
        public static bool IsWindows()
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                return true;
            }

            return false;
        }

        public static bool IsLinuxOrSimilarOS()
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux)
                || RuntimeInformation.IsOSPlatform(OSPlatform.OSX)
                || RuntimeInformation.IsOSPlatform(OSPlatform.FreeBSD))
            {
                return true;
            }

            return false;
        }

        /// <summary>
        /// Check the ACL (Windows or Linux format depending the platform) and
        /// verify if the current executing app running with the current user role
        /// is able to read and write in the given directory
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public static bool IsDirectoryReadableAndWritable(string path, bool shouldThrow = false)
        {
            try
            {
                if (string.IsNullOrEmpty(path) && shouldThrow)
                {
                    //should bubble up if shouldThrow is true also
                    throw new ArgumentNullException("path");
                }

                if (IsLinuxOrSimilarOS())
                {
                    #region Linux related FS

                    var unixFileInfo = new Mono.Unix.UnixFileInfo(path);

                    if (unixFileInfo == null || !unixFileInfo.Exists)
                    {
                        return false;
                    }

                    //If here this mean that the directory exist.
                    //We should check either we are the file/directory owner (and if we have our own permission to read/write ??)
                    //OR we should check if guest user to this directory are allowed to read/write.

                    //Getting current user executing this app
                    //See this for more info:
                    //https://learn.microsoft.com/fr-fr/dotnet/api/system.environment.username?view=net-6.0
                    //https://stackoverflow.com/questions/36429549/getting-current-user-in-net-core-console

                    string currentUserName = Environment.UserName;
                    string currentFileOwner = unixFileInfo.OwnerUser.UserName;

                    //If here, this mean that current user executing the app is the same own of the given path.
                    //Still have to check the permissions
                    if (currentUserName.Equals(currentFileOwner, StringComparison.Ordinal))
                    {
                        //We should accept this only if user is same with same casing, as for Linux logic.
                        //TODO
                        fdsfsd;

                        return; //Return the value
                    }

                    var currentUserInfo = new Mono.Unix.UnixUserInfo(currentUserName);
                        
                    if (currentUserInfo != null)
                    {
                        currentUserInfo

                        //TODO: Check current user group. Then check current file group.
                        //If match, check if the group has read and write permissions
                        fdsf;

                        return; //return the value
                    }

                    //TODO: Do check for public "other" permission on folder
                    fdsfd;




                    //// set file permission to 644
                    //unixFileInfo.FileAccessPermissions =
                    //    FileAccessPermissions.UserRead | FileAccessPermissions.UserWrite
                    //    | FileAccessPermissions.GroupRead
                    //    | FileAccessPermissions.OtherRead;

                    #endregion Linux related FS
                }
                else if (IsWindows())
                {
                    //TODO: Windows implementation
                    fsdf;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception)
            {
                if (shouldThrow)
                {
                    throw;
                }
            }
        }
    }
}
