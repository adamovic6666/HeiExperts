var ldap = require("ldapjs");

export default async function handler(req: any, res: any) {
  const password = "MhkV3wp2IfF4u1xf";
  const user = "bindheiexpert";
  const attributes = ["mail", "sn", "sAMAccountName", "displayName", "givenName", "distinguishedName"];
  const base = "OU=rzuser,DC=ad,DC=uni-heidelberg,DC=de";
  const url = "ldap://ad.uni-heidelberg.de";
  const memberOf = "memberOf:1.2.840.113556.1.4.1941:=CN=UniHD";
  const ouFilterPart = "OU=Uni-ID";
  let data: any;

  const { email } = req.body;

  const client = ldap.createClient({
    url: url,
  });

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  // email or uniID
  const userCredentials = emailRegex.test(email) ? `(mail=${email})` : `(sAMAccountName=${email})`;

  const filter = `(&${userCredentials}(|(${memberOf}-andereMitglieder,${ouFilterPart},${base})(${memberOf}-ruhendeMitgliedschaft,${ouFilterPart}, ${base})(${memberOf}-Mitarbeiter,${ouFilterPart},${base}))(cn=*)`;
  client.bind(user, password, async (err: any) => {
    if (err) {
      res.status(422).json({ data: "error connection" });
    } else {
      const opts = {
        //cn=*
        filter: filter,
        scope: "sub",
        attributes: attributes,
        sizeLimit: 10,
        paged: true,
        timeLimit: 60,
      };
      const search = async () => {
        const items: any[] = [];
        return new Promise((resolve, reject) => {
          client.search(base, opts, (_: any, ldapRes: any) => {
            ldapRes.on("searchEntry", (entry: any) => {
              const [, pathIdentifier, , , ,] = entry.pojo.attributes[2]?.values[0].split(",");
              const [, instituteCode] = pathIdentifier.split("=");

              const modifiedObject = {
                firstName: entry.pojo.attributes[1]?.values[0] ?? "",
                lastName: entry.pojo.attributes[0]?.values[0] ?? "",
                fullName: entry.pojo.attributes[3].values[0] ?? "",
                sAMAccountName: entry.pojo.attributes[4]?.values[0] ?? "",
                email: entry.pojo.attributes[5]?.values[0] ?? "",
                instituteCode: instituteCode ?? "",
              };
              items.push(modifiedObject);
            });
            ldapRes.on("error", (err: any) => {
              reject(err);
            });
            ldapRes.on("end", (_: any) => {
              resolve(items);
            });
          });
        });
      };

      data = await search();
      if (data.length) {
        res.status(200).json(data[0]);
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    }
  });
}
