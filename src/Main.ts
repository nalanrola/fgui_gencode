import OS from 'os';
import FairyManager from './reader/FairyManager';
import Path from './Path';

export default class Main {
    constructor() {

        // this.test();
    }

    test() {
        let arr = ['aaaa.png', 'bbb.png', 'ccc.png'];
        let obj = {
            res: arr
        }
        Path.WriteJson('./test.json', obj);
    }

    static Init(clientPath: string, output: string) {
        if(!Path.IsDirectory(clientPath))
            throw new Error(`project path url not found: ${clientPath}`);
        if(!Path.IsDirectory(output))
            throw new Error(`output path url not found: ${output}`);
        if(!clientPath.endsWith('/'))
            clientPath += '/';
        
        let mgr = new FairyManager();

        let assetPath = clientPath + "arts_project/Game-FGUI";
        let resPath = clientPath + "client/Game/bin/res/fgui";
        
        mgr.LoadProject(assetPath);
        mgr.ExportTS();

        mgr.ExportRes(resPath);

        // let src = "./bin/assets/Component~NCode/GoButton.xml";
        // let exist = FS.Exists(src);
        // console.log(exist)
    }


}

new Main();