const path = require("path");
import { exec } from "child_process";

export default function handler(req, res) {
  console.log(req.query);
  console.log(req.query.edition);
  console.log(req.query.signer);
  const  {signer}  = req.query;
  const edvalue=req.query.edition;
  let Edition;
  if(edvalue=='Silver')
  {
    Edition=1;
  }
  else if(edvalue=='Gold')
  {
    Edition=2;
  }
  else if(edvalue=='Diamond')
  {
    Edition=3;
  }
  else
  {
    console.log(edvalue);
  }
  // pick 1 from n total
  let sc=0;
  let gc=0;
  let dc=0;

  const nftDataFile = path.join(
    process.env.NFT_COLLECTION_PATH,
    `${Edition}-nft.json`
  );

  const commandstr = `metaboss mint one --keypair ${process.env.MERCHANT_KEYPAIR_PATH} --nft-data-file ${nftDataFile} --receiver ${signer} --rpc ${process.env.NEXT_PUBLIC_RPC_URL}`;

  let success = true;

  exec(commandstr, (err, stdout, stderr) => {
    if (err) {
      success = false;
      console.error("err", err);
    }

    if (stderr) {
      success = false;
      console.error("stderr", stderr);
    }

    if (stdout) {
      let data=stdout.split(" ");
      let mintAccount=data[4].split("\n");
      console.log(mintAccount[0]);
      if(Edition==1)
      {
        sc=sc+1;
      }
      if(Edition==2)
      {
        gc=gc+1;
      }
      if(Edition==3)
      {
        dc=dc+1;
      }
    }

    if (success) {
      res.status(200).json({ signer: req.query.signer, success: true });
    } else {
      res.status(500).json({ success: false, stderr: stderr });
    }
  });
}

export const config = {
  api: {
    externalResolver: true,
  },
};
