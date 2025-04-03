import { useState } from 'react'
import './App.css'

function App() {

  return (
    <div className='main-container'>
      <div className='header'>
        <h1 className='title'>All You Need To Set Up a Modded Minecraft Server Using Forge on Ubuntu Server for Minecraft 1.18.2</h1>
        <h2 className='subtitle'>A Step-by-Step Guide</h2>
        <p className='description'>I created this server to play with my friends and to learn more about Linux commands and server management. 
          After completing the server setup and struggling to find clear instructions for everything I needed, I decided to share my knowledge 
          with the world. This guide will walk you through setting up a modded Minecraft server using Forge on Ubuntu Server for Minecraft 1.18.2. 
          Whether you're new to Linux or just want to learn more about hosting a modded Minecraft server, I hope this guide will be helpful to
          anyone planning on creating their own server.</p>
      </div>
      <div className='table-of-contents'>
        <h2 className='toc-title'>Table of Contents</h2>
        <ol className='toc-list'>
          <li><a href='#section1'>Installing Ubuntu Server on an Old Laptop</a></li>
          <li><a href='#section2'>Setting Up Wi-Fi with Netplan</a></li>
          <li><a href='#section3'>Enabling SSH for Remote Access</a></li>
          <li><a href='#section4'>Installing Java 17</a></li>
          <li><a href='#section5'>Create Server Folder</a></li>
          <li><a href='#section6'>Downloading and Installing Forge 1.18.2</a></li>
          <li><a href='#section7'>Adding Mods to the Server</a></li>
          <li><a href='#section8'>Running the Server for the First Time</a></li>
          <li><a href='#section9'>Running Server in the Background With Screen</a></li>
          <li><a href='#section10'>Adjusting RAM Allocation</a></li>
          <li><a href='#section11'>Port Forwarding or Using Playit.gg</a></li>
          <li><a href='#section12'>Additional Server Settings</a></li>
          <div className='additional-settings'>
            <ol className='additional-settings-list'>
              <li><a href='#section13'>Changing the World Seed</a></li>
              <li><a href='#section14'>Enabling Commands</a></li>
              <li><a href='#section15'>Whitelisting Players</a></li>
              <li><a href='#section16'>Custom Server Icon</a></li>
              <li><a href='#section17'>Custom Server Description</a></li>
            </ol>
          </div>
        </ol>
      </div>
      <div className='content'>
        <div className='section' id='section1'>
          <h2 className='section-title'>Installing Ubuntu Server on an Old Laptop</h2>
          <h3 className='section-subtitle'>Requirements</h3>
          <ul className='section-list'>
            <li>An old laptop or computer</li>
            <li>A USB drive 8GB or more</li>
            <li>A stable internet connection</li>
          </ul>
          <h3 className='section-subtitle'>Steps</h3>
          <ol className='section-list'>
            <li>Download Ubuntu Server ISO from <a href='https://ubuntu.com/download/server' target="_blank">Ubuntu.com</a></li>
            <li>If you don't have Balena Etcher, get it from <a href='https://etcher.balena.io/' target="_blank">Balena Etcher</a>.</li>
            <li>Make a bootable USB drive, connect USB drive to computer and run Balena Etcher. Select the flash drive and the Ubuntu server .iso. WARNING: 
            doing this will erase all files in the USB drive so make sure you don't have any important information in it.</li>
            <li>Make sure the laptop where you want to install Ubuntu Server is turned off, then connect flash drive to laptop.</li>
            <li>Turn on the laptop after connecting flash drive and open the Booting Options by pressing F12, your device might have a different key to open 
              Booting Options so search online for your specific device.</li>
            <li>After opening the Booting Options, select the flash drive to boot from. This will start the Ubuntu Installation.</li>
            <li>Follow the installation process until properly installed.</li>
          </ol>
          Notice: if you made a mistake at some point you can boot from the flash drive again to restart the installation.
        </div>
        <div className='section' id='section2'>
          <h2 className='section-title'>Setting Up Wi-Fi with Netplan</h2>
          <p>If Wi-Fi connection was not set up during installation process you can configure it using Netplan:</p>
          <ol className='section-list'>
            <li>
              First check what your Wi-Fi interface is with this:
              <pre><code>ip link show</code></pre>
              Look for an interface that starts with wlan, like <code>wlan0</code> or <code>wlp2s0</code>
            </li>
            <li>
              Open the Netplan configuration file:
              <pre><code>sudo nano /etc/netplan/50-cloud-init.yaml</code></pre>
            </li>
            <li>
              Edit the file with your Wi-Fi name and password:
              <pre><code>
                network:<br />
                  version: 2<br />
                  renderer: networkd<br />
                  wifis:<br />
                    wlan0: # Replace wlan0 with your actual Wi-Fi interface<br />
                      dhcp4: yes<br />
                      access-points:<br />
                        "Your_WiFi_Name":<br />
                          password: "Your_WiFi_Password"<br />
              </code></pre>
              Notice:
              <ul>
                <li>Make sure to use 2 spaces instead of a tab for each level of indentation. YAML can be strict about it.</li>
                <li>If your Wi-Fi does not have a password don't include the password line in the file.</li>
              </ul>
            </li>
            <li>
              Save the file by pressing <code>CTRL + X</code>, then <code>Y</code>, and finally <code>ENTER</code>.
            </li>
            <li>
              Apply the changes with:
              <pre><code>sudo netplan apply</code></pre>
            </li>
            <li>
              Check if you are connected to the internet with:
              <pre><code>ping google.com</code></pre>
              If you see responses it was successful and you can continue with the next steps, otherwise, go back and check if you wrote the information in the netplan configuration correctly.
            </li>
          </ol>
        </div>
        <div className='section' id='section3'>
          <h2 className='section-title'>Enabling SSH for Remote Access</h2>
          <ol className='section-list'>
            <li>
              Install OpenSSH if you didn't install it during Ubuntu Server installation. First update the package list:
              <pre><code>sudo apt update && sudo apt install openssh-server -y</code></pre>
            </li>
            <li>
              After installing OpenSSH you have to enable SSH with the following:
              <pre><code>
                sudo systemctl enable ssh<br />
                sudo systemctl start ssh
              </code></pre>
            </li>
            <li>
              Check if SSH is running: 
              <pre><code>sudo systemctl status ssh</code></pre>
            </li>
            <li>
              Now find your server's IP address<br />
              If connecting from the same network you can find it with:
              <pre><code>ip a</code></pre>
              Look for <code>inet</code>, local IP should look something like this <code>192.168.x.x</code>.<br />
              If connecting from outside the network the server is in, use:
              <pre><code>curl ifconfig.me</code></pre>
            </li>
            <li>
              After finding your server's IP go to your computer to connect remotely to your server:
              <pre><code>
                ssh user@server-ip
              </code></pre>
              Notice:
              <ul>
                <li>User is going to be the name of your user in your server.</li>
                <li>Server-ip is going to be your server's IP address</li>
              </ul>
              If it asks you, <code>Are you sure you want to continue connecting (yes/no)?</code>, type yes.  Then enter server's password.
            </li>
          </ol>
        </div>
        <div className='section' id='section4'>
          <h2 className='section-title'>Installing Java 17</h2>
          <p>Minecraft 1.18.2 requires Java 17 so we first have to install it:</p>
          <ol className='section-list'>
            <li>Install Java 17 with: </li>
            <pre><code>
              sudo apt install openjdk-17-jdk -y
            </code></pre>
            <li>Check if the installation was done correctly with:</li>
            <pre><code>
              java -version
            </code></pre>
            <li>If you have another version of Java installed change it with:</li>
            <pre><code>
              sudo update-alternatives --config java
            </code></pre>
          </ol>
          <p>A list with all Java versions installed will appear, choose number corresponding to Java 17.</p>
        </div>
        <div className='section' id='section5'>
          <h2 className='section-title'>Create Server Folder</h2>
          <ol className='section-list'>
            <li>
              Move into the <code>/opt</code> directory:
              <pre><code>sudo cd /opt</code></pre>
            </li>
            <li>
              Make the server directory:
              <pre><code>sudo mkdir minecraft</code></pre>
              You can name this folder whatever you want.
            </li>
          </ol>
        </div>
        <div className='section' id='section6'>
          <h2 className='section-title'>Downloading and Installing Forge 1.18.2</h2>
          <ol className='section-list'>
            <li>
              Download Forge <a href='https://files.minecraftforge.net/net/minecraftforge/forge/' target="_blank">Forge Website</a>:
              <pre><code>sudo wget https://maven.minecraftforge.net/net/minecraftforge/forge/1.18.2-40.3.9/forge-1.18.2-40.3.9-installer.jar</code></pre>
              Notice: The link for the installation might be different depending on what version of Forge you want to install.
            </li>
            <li>
              After downloading the Forge installer install it with:
              <pre><code>sudo java -jar forge-1.18.2-40.3.9-installer.jar --installServer</code></pre>
              Notice: make sure the name of the installer .jar matches yours the version might be different.
            </li>
            <li>
              Run the Forge server:
              <pre><code>sudo ./run.sh</code></pre>
              Notice: Since this is a newer version of Forge it doesn't install the Minecraft server jar file, all you have to do is run the run.sh file.
            </li>
            <li>
              After running the run.sh file accept the <b>EULA</b>:
              <pre><code>sudo nano eula.txt</code></pre>
              Change <code>eula=false</code> to <code>eula=true</code>
            </li>
          </ol>
        </div>
        <div className='section' id='section7'>
          <h2 className='section-title'>Adding Mods to the Server</h2>
          <ol className='section-list'>
            <li>
              Download the mods you want to use on your server, make sure to download the same version as the Minecraft and Forge version you are using. Get mods at <a href='https://www.curseforge.com/minecraft' target="_blank">CurseForge</a>.
            </li>
            <li>
              Transfer them to the server using WinSCP or SCP:<br />
              Using SCP:
              <pre><code>sudo scp modfile.jar user@server-ip:/opt/minecraft/mods/</code></pre>
              Note: I recommend using WinSCP because I personally found it quicker. The only thing was it didn't let me transfers files directly to the opt/ directory because I didn't have permission. What I did was transfer the files to <code>~/HomeDirectory</code> and then moved them using:
              <pre><code>	sudo mv ~/mods/* /opt/minecraft/mods</code></pre>
              This way, I just transferred my mods folder to my home directory then moved all the mods inside that folder to the mods folder in the Minecraft server.<br />
              Notice: If, after the Forge installation and running the run.sh file, the mods folder wasn't created, create it with <code>sudo mkdir mods</code>
            </li>
          </ol>
        </div>
        <div className='section' id='section8'>
          <h2 className='section-title'>Running the Server for the First Time</h2>
          <ol className='section-list'>
            <li>Run the server with:</li>
            <pre><code>sudo ./run.sh</code></pre>
            <li>After running the server, it will take a while to load all the mods and create the world.</li>
            <li>After loading, you can stop the server with:</li>
            <pre><code>stop</code></pre>
          </ol>
        </div>
        <div className='section' id='section9'>
          <h2 className='section-title'>Running Server in the Background With Screen</h2>
          <p>If you want to run the server in the background, you can use screen or tmux. I recommend using screen because it's easier to use.</p>
          <ol className='section-list'>
            <li>
              Install screen:
              <pre><code>sudo apt install screen</code></pre>
            </li>
            <li>
              Run the server with screen:
              <pre><code>screen -S minecraft ./run.sh</code></pre>
            </li>
            <li>To detach from the screen session, press <code>CTRL + A</code>, then <code>D</code>.</li>
            <li>
              To reattach to the screen session, use:
              <pre><code>screen -r minecraft</code></pre>
            </li>
          </ol>
          Notice: If you want to stop the server, you have to reattach to the screen session and then use the stop command.
        </div>
        <div className='section' id='section10'>
          <h2 className='section-title'>Adjusting RAM Allocation</h2>
          <p>To adjust server settings, you can edit the <code>server.properties</code> file:</p>
          <ol className='section-list'>
            <li>
              Modify <code>user_jvm_args.txt</code> to set RAM allocation:
              <pre><code>sudo nano user_jvm_args.txt</code></pre>
              Example settings (for a 6GB RAM system):<br />
              <code>-Xms2G -Xmx4G</code>
              <ul>
                <li>Xms2G: sets the minimum amount of RAM to use.</li>
                <li>Xmx4G: sets the maximum amount of RAM to use.</li>
              </ul>
            </li>
            <li>
              If you are not sure how much RAM your system has check with:
              <pre><code>free -h</code></pre>
              Notice: Don't use all of your available RAM, leave 1-2G for your system to use
            </li>
          </ol>
        </div>
        <div className='section' id='section11'>
          <h2 className='section-title'>Port Forwarding or Using Playit.gg</h2>
          <h3>Option 1: Port Forwarding</h3>
          <ol className='section-list'>
            <li>
              Open your routers settings by putting local IP on search bar on a search engine.
              <pre><code>ip a</code></pre>
            </li>
            <li>
              Find Port Forwarding in your router's settings and set:
              <ul>
                <li>Port: <code>25565</code></li>
                <li>Protocol: <code>TCP/UDP</code></li>
                <li>Local IP: Server's internal IP</li>
              </ul>
            </li>
            <li>
              Find your public IP to give to your friends:
              <pre><code>curl ifconfig.me</code></pre>
            </li>
          </ol>
          <h3>Option 2: Using Playit.gg</h3>
          <ol className='section-list'>
            <li>
              Download Playit.gg from <a href='https://playit.gg/download/linux' target="_blank">here</a>:
              <pre><code>sudo wget https://github.com/playit-cloud/playit-agent/releases/download/v0.15.26/playit-linux-amd64</code></pre>
            </li>
            <li>
              Rename the file for ease of use:
              <pre><code>sudo mv playit-linux-amd64 playit</code></pre>
            </li>
            <li>
              Run the tunnel:
              <pre><code>./playit</code></pre>
            </li>
            <li>Follow the on screen instructions to start the tunnel.</li>
            <li>Share the given Playit.gg IP with friends.</li>
          </ol>
          <p>Notice: You can run this in the background using screen. Use Step 9 as a guide.</p>
        </div>
        <div className='section' id='section12'>
          <h2>Additional Server Settings</h2>
          <h3 id ='section13'>Changing the World Seed</h3>
          <ol className='section-list'>
            <li>
              To change the seed edit <code>server.properties</code> and change this line:
              <pre><code>level-seed=123456789 # The seed you want to use</code></pre>
            </li>
            <li>
              Delete old world and run run.sh again so world gets regenerated:
              <pre><code>rm -r world</code></pre>
            </li>
          </ol>
          <h3 id ='section14'>Enabling Commands (OP Permissions)</h3>
          <ul className='section-list'>
            <li>
              Enable commands while In-game:
              <pre><code>/op YourUsername</code></pre>
            </li>
            <li>
              Or from the console that is running the server:
              <pre><code>op YourUsername</code></pre>
            </li>
          </ul>
          <h3 id ='section14'>Whitelisting Players</h3>
          <ol className='section-list'>
            <li>
              To enable whitelisting go into `server.properties` and change this line:
              <pre><code>white-list=true</code></pre>
            </li>
            <li>
              List of commands to add, remove, and list all whitelisted users:
              <pre><code>
                whitelist add FriendUsername<br />
                whitelist remove FriendUsername<br />
                whitelist list
              </code></pre>
            </li>
          </ol>
          <h3 id ='section15'>Custom Server Icon</h3>
          <ol className='section-list'>
            <li>Select the image you want to use and resize it to 64x64 pixels and make sure its a PNG.</li>
            <li>Name it <code>server-icon.png</code>.</li>
            <li>Upload it to <code>/opt/minecraft/</code>.</li>
            <li>Restart server.</li>
          </ol>
          <h3 id ='section16'>Custom Server Description (MOTD)</h3>
            <ol className='section-list'>
              <li>
                To change the description of the Minecraft server go into <code>server.properties</code> and change this line:
                <pre><code>motd=§6Welcome to §aMy Minecraft Server! §9Enjoy!</code></pre>
              </li>
              <li>You can add color codes using the § symbol and customize your message as needed.</li>
            </ol>
        </div>
      </div>
      <footer>
        <p>&copy; 2025 David Salas C. All rights reserved.</p>
      </footer>
      <a href="#top" id="scrollToTop" class="scroll-to-top">
        &#8593;
      </a>
    </div>
  )
}

export default App
